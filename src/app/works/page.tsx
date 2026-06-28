import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";
import { getProjectsByDivision } from "@/lib/ourWorksCms";
import { buildMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(pageSeo["/works"]);

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const projects = await getProjectsByDivision("Architecture");

  return (
    <main className="min-h-screen bg-white">
      <ArchitectureNav />

      <section className="px-5 pb-20 pt-36 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Portfolio</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
              Our Works
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-500">
              A curated collection of projects across architecture, construction,
              real estate, and digital services.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/works/${project.slug}`}
                className="group block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                    {project.division}
                  </p>
                  <h2 className="mt-1 text-xl font-bold leading-tight text-stone-950">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">{project.location}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">
                    {project.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 transition-all group-hover:gap-2">
                    View Project <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ArchitectureFooter />
    </main>
  );
}
