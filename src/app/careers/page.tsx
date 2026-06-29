import type { Metadata } from "next";
import { buildMetadata, pageSeo } from "@/lib/seo";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

export const metadata: Metadata = buildMetadata(pageSeo["/careers"]);

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-graphite text-warm-white">
      <ArchitectureNav />
      <section className="px-6 pb-32 pt-40 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Careers
          </h1>
          <p className="text-lg leading-relaxed text-warm-muted sm:text-xl">
            Join Ractysh Design Private Limited. We are always looking for
            talented architects, interior designers, planners, and design
            professionals to be part of our team creating timeless built
            environments.
          </p>
        </div>
      </section>
      <ArchitectureFooter />
    </main>
  );
}
