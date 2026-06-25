import type { Metadata } from "next";
import { ArchitectureCinematicExperience } from "@/components/ArchitectureCinematicExperience";
import { getArchitecturePageData } from "@/lib/architectureCms";
import { seoContent } from "@/lib/architecturePremiumContent";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createPageMetadata();
}

const architectureStructuredData = {
  "@context": "https://schema.org",
  "@type": "ArchitecturalService",
  name: "Ractysh Design Private Limited",
  url: "https://architecture.ractysh.com",
  logo: "https://architecture.ractysh.com/images/architecture/ractysh-architecture-logo.webp",
  image: "https://architecture.ractysh.com/images/architecture/ractysh-built-beyond-blueprints-poster.webp",
  description: seoContent.metaDescription,
  areaServed: ["Coimbatore", "Palani", "Dindigul", "Tamil Nadu", "Kerala", "Bengaluru", "Chennai", "International"],
  email: "ractyshdesign@gmail.com",
  parentOrganization: {
    "@type": "Organization",
    name: "Ractysh Group",
    url: "https://ractysh.com"
  },
  serviceType: [
    "Architectural Design",
    "Interior Design",
    "Structural Design",
    "MEP Design",
    "Landscape Design",
    "Urban Planning",
    "3D Modelling & Visualisation",
    "Architectural Rendering",
    "Furniture Design",
    "Architectural Lighting Design",
    "Elevation Design",
    "Commercial Building Design",
    "Project Management Consultancy",
    "Logo Design"
  ]
};

export default async function Home() {
  const data = await getArchitecturePageData();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(architectureStructuredData) }} />
      <ArchitectureCinematicExperience hero={data.hero} projects={data.projects} />
    </>
  );
}
