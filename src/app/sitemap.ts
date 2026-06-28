import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getProjectsByDivision } from "@/lib/ourWorksCms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/services`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/works`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/industrial-design`, lastModified, changeFrequency: "monthly" as const, priority: 0.72 },
    { url: `${SITE_URL}/privacy-policy`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/terms-and-conditions`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/cookie-policy`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/disclaimer`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjectsByDivision("Architecture");
    projectRoutes = projects.map((project) => ({
      url: `${SITE_URL}/works/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.64,
    }));
  } catch {
    // CMS unavailable — skip dynamic routes
  }

  return [...staticRoutes, ...projectRoutes];
}
