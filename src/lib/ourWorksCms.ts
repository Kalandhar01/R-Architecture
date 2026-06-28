import dbConnect from "@/lib/db"
import type { PortfolioProjectDocument } from "@/models/OurWorkProject"
import PortfolioProject from "@/models/OurWorkProject"

export interface PortfolioProjectView {
  id: string
  title: string
  slug: string
  division: string
  description: string
  shortDescription?: string
  location: string
  status: string
  coverImage: string
  galleryImages: string[]
  featured: boolean
}

function toView(doc: PortfolioProjectDocument): PortfolioProjectView {
  const image = doc.coverImage || ""
  const galleryImages = Array.from(new Set([image, ...(doc.galleryImages || [])].filter(Boolean)))

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    division: doc.division || "",
    description: doc.description || "",
    shortDescription: doc.shortDescription || "",
    location: doc.location || "",
    status: doc.status || "Completed",
    coverImage: image,
    galleryImages,
    featured: doc.featured || false,
  }
}

export async function getProjectsByDivision(division: string): Promise<PortfolioProjectView[]> {
  try {
    await dbConnect()

    const docs = await PortfolioProject.find({ division, published: true })
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 })
      .lean()

    if (!docs.length) return []

    return docs.map((doc) => toView(doc as unknown as PortfolioProjectDocument))
  } catch (error) {
    console.warn("[ourWorksCms] Failed to fetch projects:", error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProjectView | null> {
  try {
    await dbConnect()

    const doc = await PortfolioProject.findOne({ slug, published: true }).lean()
    if (!doc) return null

    return toView(doc as unknown as PortfolioProjectDocument)
  } catch (error) {
    console.warn("[ourWorksCms] Failed to fetch project by slug:", error)
    return null
  }
}
