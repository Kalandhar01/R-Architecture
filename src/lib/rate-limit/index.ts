const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  windowMs: number = 10 * 60_000,
  maxRequests: number = 8
): { allowed: boolean; retryAfter: number | null } {
  const now = Date.now();
  
  if (rateLimitBuckets.size > 10000) {
    for (const [bucketKey, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
  }
  
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: null };
  }
  
  bucket.count += 1;
  if (bucket.count <= maxRequests) return { allowed: true, retryAfter: null };
  
  return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
}

export function clientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-client-ip") ||
    forwardedFor ||
    "anonymous"
  );
}
