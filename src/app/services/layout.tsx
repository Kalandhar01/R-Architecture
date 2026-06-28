import type { Metadata } from "next";
import { buildMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(pageSeo["/services"]);

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
