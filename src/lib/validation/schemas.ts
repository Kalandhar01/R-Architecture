import { z } from "zod";

export const emailSchema = z.string().email().max(180).transform(v => v.toLowerCase().trim());

export const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name.").max(120).transform(v => v.trim()),
  email: emailSchema,
  phone: z.string().max(60).optional().default("").transform(v => v.trim()),
  projectType: z.string().max(140).default("Architecture consultation").transform(v => v.trim()),
  location: z.string().max(160).optional().default("").transform(v => v.trim()),
  budget: z.string().max(120).optional().default("").transform(v => v.trim()),
  message: z.string().min(1, "Please enter your project brief.").max(4000).transform(v => v.trim()),
  sourcePage: z.string().max(1000).optional().default("").transform(v => v.trim()),
  website: z.string().max(200).optional().default("").transform(v => v.trim()),
  csrfToken: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: emailSchema,
  source: z.string().max(120).optional().default("architecture_footer_newsletter"),
  csrfToken: z.string().optional(),
});

export const analyticsSchema = z.object({
  type: z.enum(["page", "project"]),
  path: z.string().max(500),
  projectId: z.string().optional(),
  projectSlug: z.string().optional(),
});

export const contactFormSchemaStrict = contactFormSchema.refine(
  (data) => !data.website,
  { message: "Spam protection triggered." }
);
