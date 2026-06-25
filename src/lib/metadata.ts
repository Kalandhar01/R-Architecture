import type { Metadata } from "next";
import { seoContent } from "@/lib/architecturePremiumContent";

const siteUrl = "https://architecture.ractysh.com";

export function createPageMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const title = overrides?.title || seoContent.metaTitle;
  const description = overrides?.description || seoContent.metaDescription;
  const path = overrides?.path || "/";
  const images = overrides?.ogImage
    ? [{ url: overrides.ogImage, width: 1200, height: 675, alt: "Ractysh Design Private Limited" }]
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: "Ractysh Architecture",
      title: title,
      description: description,
      images,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: overrides?.ogImage ? [overrides.ogImage] : undefined,
    },
  };
}
