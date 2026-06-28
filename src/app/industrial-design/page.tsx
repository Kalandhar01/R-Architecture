import type { Metadata } from "next";
import { IndustrialDesignExperience } from "@/components/IndustrialDesignExperience";
import { buildMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(pageSeo["/industrial-design"]);

export default function IndustrialDesignPage() {
  return <IndustrialDesignExperience />;
}
