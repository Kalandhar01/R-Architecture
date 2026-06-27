import type { NextConfig } from "next";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel-insights.com https://vercel.live`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https: http://localhost:3001`,
  `font-src 'self' data:`,
  `media-src 'self' blob: https:`,
  `connect-src 'self' https://*.resend.com https://api.resend.com wss: https://*.vercel-insights.com https://vercel.live`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join("; ");

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 78, 84, 90],
    deviceSizes: [480, 720, 1024, 1280, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dswl2wqf4/**",
      },
    ],
  },
  allowedDevOrigins: ["10.177.149.172"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
