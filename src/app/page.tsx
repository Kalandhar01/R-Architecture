import type { Metadata } from "next";
import { ArchitectureCinematicExperience } from "@/components/ArchitectureCinematicExperience";
import { getArchitecturePageData } from "@/lib/architectureCms";
import { buildMetadata, pageSeo, SITE_URL, COMPANY_NAME, COMPANY_SHORT, CIN, COMPANY_EMAIL, OG_IMAGE, LOGO_IMAGE } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return buildMetadata(pageSeo["/"]);
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_NAME,
  alternateName: COMPANY_SHORT,
  legalName: COMPANY_NAME,
  identifier: CIN,
  url: SITE_URL,
  logo: `${SITE_URL}${LOGO_IMAGE}`,
  image: `${SITE_URL}${OG_IMAGE}`,
  description: pageSeo["/"].description,
  email: COMPANY_EMAIL,
  foundingDate: "2025-11-06",
  founder: {
    "@type": "Person",
    name: "Ar. P.M.S. Noorul Fawaaz",
    description: "B.Arch., A.I.I.A.",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "D.No.236A, K.K.N. Patty",
    addressLocality: "Palani",
    addressRegion: "Dindigul",
    postalCode: "624601",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Architecture",
    "Interior Design",
    "Planning",
    "Construction Design",
    "Design Consultancy",
  ],
  sameAs: [
    "https://www.linkedin.com/company/ractysh-design",
    "https://www.instagram.com/ractysh_design",
  ],
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: COMPANY_SHORT,
  legalName: COMPANY_NAME,
  url: SITE_URL,
  image: `${SITE_URL}${OG_IMAGE}`,
  email: COMPANY_EMAIL,
  areaServed: [
    "Coimbatore",
    "Palani",
    "Dindigul",
    "Tamil Nadu",
    "Kerala",
    "Bengaluru",
    "Chennai",
  ],
  serviceType: [
    "Architectural Design",
    "Interior Design",
    "Structural Design",
    "Landscape Design",
    "Urban Planning",
    "3D Modelling & Visualisation",
    "Residential Architecture",
    "Commercial Architecture",
    "Villa Design",
    "Master Planning",
    "Turnkey Design Consultancy",
  ],
  founder: {
    "@type": "Person",
    name: "Ar. P.M.S. Noorul Fawaaz",
    credentialCategory: "B.Arch., A.I.I.A.",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Ractysh Group",
    url: "https://ractysh.com",
  },
};

const architectSchema = {
  "@context": "https://schema.org",
  "@type": "Architect",
  name: COMPANY_SHORT,
  legalName: COMPANY_NAME,
  url: SITE_URL,
  image: `${SITE_URL}${OG_IMAGE}`,
  email: COMPANY_EMAIL,
  areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "India"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: COMPANY_SHORT,
  alternateName: COMPANY_NAME,
  url: SITE_URL,
  description: pageSeo["/"].description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

export default async function Home() {
  const data = await getArchitecturePageData();

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={professionalServiceSchema} />
      <JsonLd data={architectSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ArchitectureCinematicExperience hero={data.hero} projects={data.projects} />
    </>
  );
}
