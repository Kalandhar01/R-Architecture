import type { Metadata } from "next";

export const SITE_URL = "https://architecture.ractysh.com";
export const SITE_NAME = "Ractysh Design Pvt Ltd";
export const COMPANY_NAME = "RACTYSH DESIGN PRIVATE LIMITED";
export const COMPANY_SHORT = "Ractysh Design Pvt Ltd";
export const CIN = "U41001TZ2025PTC036582";
export const COMPANY_EMAIL = "ractyshdesign@gmail.com";

export const OG_IMAGE = "/images/architecture/ractysh-built-beyond-blueprints-poster.webp";
export const LOGO_IMAGE = "/images/architecture/ractysh-architecture-logo.webp";

export const SITE_DESCRIPTION =
  "Ractysh Design Private Limited is a premium architecture and interior design firm based in Tamil Nadu, delivering residential, commercial, institutional, planning, and design consultancy with innovative and sustainable solutions.";

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
}

export const pageSeo: Record<string, PageSeo> = {
  "/": {
    title: "Ractysh Design Pvt Ltd | Luxury Architecture & Interior Design",
    description: SITE_DESCRIPTION,
    keywords: [
      "Ractysh Design",
      "Ractysh Architects",
      "Architecture Company",
      "Luxury Architecture",
      "Interior Design",
      "Commercial Architecture",
      "Residential Architecture",
      "Architects in Tamil Nadu",
      "Architects in Palani",
      "Architects in Dindigul",
      "Architecture Consultancy",
      "Building Design",
      "Villa Design",
      "Interior Design Studio",
      "Modern Architecture",
    ],
    path: "/",
  },
  "/services": {
    title: "Architecture & Interior Design Services | Ractysh Design Pvt Ltd",
    description:
      "Explore Ractysh Design's full range of services: residential architecture, commercial architecture, interior design, villa design, master planning, landscape design, and turnkey design consultancy.",
    keywords: [
      "Residential Architecture",
      "Commercial Architecture",
      "Interior Design",
      "Villa Design",
      "Luxury Residence",
      "Workspace Design",
      "Planning Consultancy",
      "Turnkey Design",
      "Master Planning",
      "Landscape Design",
      "Institutional Architecture",
      "Urban Design",
    ],
    path: "/services",
  },
  "/works": {
    title: "Our Portfolio | Ractysh Design Pvt Ltd",
    description:
      "Browse the portfolio of Ractysh Design Private Limited featuring residential, commercial, institutional, and luxury architecture projects across Tamil Nadu and India.",
    path: "/works",
  },
  "/industrial-design": {
    title: "Industrial Architecture Design | Ractysh Design Pvt Ltd",
    description:
      "Industrial facilities engineered through architectural intelligence, operational efficiency, and long-term growth planning by Ractysh Design Private Limited.",
    path: "/industrial-design",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Ractysh Design Private Limited",
    description:
      "Privacy Policy of Ractysh Design Private Limited. Learn how we collect, use, and protect your personal information.",
    path: "/privacy-policy",
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | Ractysh Design Private Limited",
    description:
      "Terms and Conditions for using the Ractysh Design Private Limited website and services.",
    path: "/terms-and-conditions",
  },
  "/cookie-policy": {
    title: "Cookie Policy | Ractysh Design Private Limited",
    description:
      "Cookie Policy of Ractysh Design Private Limited. Learn how we use cookies and similar tracking technologies.",
    path: "/cookie-policy",
  },
  "/disclaimer": {
    title: "Disclaimer | Ractysh Design Private Limited",
    description:
      "Disclaimer of Ractysh Design Private Limited regarding the use of our website, content, and services.",
    path: "/disclaimer",
  },
};

export function buildMetadata(seo: PageSeo, ogImage?: string): Metadata {
  const url = `${SITE_URL}${seo.path}`;
  const image = ogImage || OG_IMAGE;

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: COMPANY_SHORT,
      title: seo.title,
      description: seo.description,
      locale: "en_IN",
      images: [
        {
          url: image,
          width: 1200,
          height: 675,
          alt: COMPANY_SHORT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [image],
    },
  };
}
