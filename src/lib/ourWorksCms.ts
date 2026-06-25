import dbConnect from "@/lib/db"
import OurWorkProject, { type OurWorkProjectDocument } from "@/models/OurWorkProject"

export interface OurWorkProjectView {
  id: string
  title: string
  slug: string
  category: string
  description: string
  location: string
  status: string
  coverImage: string
  galleryImages: string[]
  featured: boolean
  number: string
  kicker: string
  projectType: string
  image: string
  alt: string
  scale: string
  detail: string
  year: string
  area: string | null
  place: string
}

function toView(doc: OurWorkProjectDocument, index: number): OurWorkProjectView {
  const num = String(index + 1).padStart(2, "0")
  const image = doc.coverImage || ""
  const galleryImages = Array.from(new Set([image, ...doc.galleryImages].filter(Boolean)))

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    description: doc.description || "",
    location: doc.location || "",
    status: doc.status || "Completed",
    coverImage: image,
    galleryImages,
    featured: doc.featured || false,
    number: num,
    kicker: doc.category,
    projectType: doc.category,
    image,
    alt: `${doc.title} — ${doc.category}`,
    scale: doc.category,
    detail: doc.description || "",
    year: new Date(doc.createdAt).getFullYear().toString(),
    area: null,
    place: doc.location || "",
  }
}

export async function getOurWorksProjects(category?: string): Promise<OurWorkProjectView[]> {
  try {
    await dbConnect()

    const filter: Record<string, unknown> = { published: true }
    if (category && category !== "All") filter.category = category

    const docs = await OurWorkProject.find(filter)
      .sort({ featured: -1, position: 1, createdAt: -1 })
      .lean()

    if (!docs.length) return []

    return docs.map((doc, i) => toView(doc as unknown as OurWorkProjectDocument, i))
  } catch (error) {
    console.warn("[ourWorksCms] Failed to fetch projects:", error)
    return []
  }
}

export async function getOurWorkProjectBySlug(
  slug: string
): Promise<OurWorkProjectView | null> {
  try {
    await dbConnect()

    const doc = await OurWorkProject.findOne({ slug, published: true }).lean()
    if (!doc) return null

    return toView(doc as unknown as OurWorkProjectDocument, 0)
  } catch (error) {
    console.warn("[ourWorksCms] Failed to fetch project by slug:", error)
    return null
  }
}

export async function getOurWorksCategories(): Promise<string[]> {
  try {
    await dbConnect()
    const categories = await OurWorkProject.distinct("category", { published: true })
    return categories.length ? categories : ["Architecture Works", "Construction Works"]
  } catch {
    return ["Architecture Works", "Construction Works"]
  }
}
