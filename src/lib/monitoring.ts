export function safeAnalyticsFetch(url: string, data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => undefined);
}

export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export function safeSessionStorageGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionStorageSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // noop
  }
}

export function logWarning(context: string, message: string, data?: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[${context}] ${message}`, data);
  }
}

export function logError(context: string, message: string, error?: unknown): void {
  console.error(`[${context}] ${message}`, error);
}
