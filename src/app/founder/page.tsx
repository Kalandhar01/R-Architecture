import type { Metadata } from "next";
import { buildMetadata, pageSeo } from "@/lib/seo";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

export const metadata: Metadata = buildMetadata(pageSeo["/founder"]);

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-graphite text-warm-white">
      <ArchitectureNav />
      <section className="px-6 pb-32 pt-40 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Our Founder
          </h1>
          <p className="text-lg leading-relaxed text-warm-muted sm:text-xl">
            Ar. P.M.S. Noorul Fawaaz, B.Arch., A.I.I.A., is the visionary
            founder of Ractysh Design Private Limited. With a deep commitment to
            architectural excellence, he leads the firm in creating innovative,
            sustainable, and culturally resonant built environments across
            residential, commercial, and luxury projects.
          </p>
        </div>
      </section>
      <ArchitectureFooter />
    </main>
  );
}
