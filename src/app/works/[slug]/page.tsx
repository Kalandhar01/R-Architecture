import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";
import { getProjectBySlug, getProjectsByDivision } from "@/lib/ourWorksCms";
import type { Metadata } from "next";
import { SITE_URL, COMPANY_SHORT, OG_IMAGE } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  const title = `${project.title} | ${COMPANY_SHORT}`;
  const description = project.shortDescription || project.description;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/works/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/works/${slug}`,
      siteName: COMPANY_SHORT,
      type: "article",
      images: project.coverImage
        ? [{ url: project.coverImage, width: 1200, height: 675, alt: project.title }]
        : [{ url: OG_IMAGE, width: 1200, height: 675, alt: COMPANY_SHORT }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.coverImage ? [project.coverImage] : [OG_IMAGE],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getProjectsByDivision("Architecture");
  const related = allProjects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const gallery = project.galleryImages.slice(1);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: project.title,
          description: project.shortDescription || project.description,
          image: project.coverImage,
          author: { "@type": "Organization", name: COMPANY_SHORT },
          url: `${SITE_URL}/works/${slug}`,
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/works/${slug}` },
        }}
      />
      <ArchitectureNav />
      <section className="px-5 pb-20 pt-36 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/works" className="group mb-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 transition-colors hover:text-stone-700">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Works</span>
          </Link>

          <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-stone-100">
            <img src={project.coverImage} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>

          <div className="mb-16 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">{project.division}</p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-stone-600">{project.description}</p>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <MapPin className="h-4 w-4 text-amber-700/60" />
                <span>{project.location}</span>
              </div>
            </div>
          </div>

          {gallery.length > 0 && (
            <section className="mb-24">
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-stone-400">Project Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((image, i) => (
                  <div key={`gallery-${i}`} className={`group relative overflow-hidden rounded-xl bg-stone-100 ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                    <div className="relative aspect-[4/3]">
                      <img src={image} alt={`${project.title} gallery ${i + 1}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="border-t border-stone-200 pt-16">
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Related Projects</h2>
              <p className="mb-10 text-stone-500">Explore more from our portfolio.</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.id} href={`/works/${item.slug}`} className="group block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
                      <img src={item.coverImage} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">{item.division}</p>
                      <h3 className="mt-1 text-xl font-bold leading-tight text-stone-950">{item.title}</h3>
                      <p className="mt-1 text-sm text-stone-500">{item.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
      <ArchitectureFooter />
    </main>
  );
}
