export const config = {
  site: {
    url: "https://architecture.ractysh.com",
    name: "Ractysh Architecture",
  },
  mongodb: {
    uri: () => process.env.MONGODB_URI || "",
  },
  resend: {
    apiKey: () => process.env.RESEND_API_KEY || "",
    fromEmail: process.env.RESEND_FROM_EMAIL || "Ractysh Design Private Limited <onboarding@resend.dev>",
    contactMailTo: process.env.ARCHITECTURE_CONTACT_MAIL_TO || "",
  },
  admin: {
    sessionSecret: process.env.ADMIN_SESSION_SECRET || "architecture",
  },
  rateLimit: {
    windowMs: 10 * 60_000,
    maxRequests: 8,
  },
} as const;
