import type { Metadata } from "next";
import { buildMetadata, pageSeo } from "@/lib/seo";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

export const metadata: Metadata = buildMetadata(pageSeo["/contact"]);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-graphite text-warm-white">
      <ArchitectureNav />
      <section className="px-6 pb-32 pt-40 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Contact Us
          </h1>
          <p className="text-lg leading-relaxed text-warm-muted sm:text-xl">
            Get in touch with Ractysh Design Private Limited for residential,
            commercial, interior design, and architecture consultancy services.
            We would love to discuss your next project.
          </p>
        </div>
      </section>
      <ArchitectureFooter />
    </main>
  );
}
