import type { Metadata } from "next";
import { buildMetadata, pageSeo } from "@/lib/seo";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

export const metadata: Metadata = buildMetadata(pageSeo["/about"]);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-graphite text-warm-white">
      <ArchitectureNav />
      <section className="px-6 pb-32 pt-40 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            About Ractysh Design
          </h1>
          <p className="text-lg leading-relaxed text-warm-muted sm:text-xl">
            Ractysh Design Private Limited is a premium architecture, interior
            design, planning, and design consultancy firm based in Tamil Nadu.
            We deliver residential, commercial, institutional, and luxury
            architectural solutions with innovation, sustainability, and
            timeless design.
          </p>
        </div>
      </section>
      <ArchitectureFooter />
    </main>
  );
}
