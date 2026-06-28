import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import PortfolioProject from "@/models/OurWorkProject"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const division = searchParams.get("division")
    const slug = searchParams.get("slug")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const featured = searchParams.get("featured")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
    const admin = searchParams.get("admin")

    if (slug) {
      const project = await PortfolioProject.findOne({ slug }).lean()
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      return NextResponse.json({ project })
    }

    const filter: Record<string, unknown> = {}

    if (admin !== "true") {
      filter.published = true
    }

    if (division) filter.division = division
    if (status && status !== "All") filter.status = status
    if (featured === "true") filter.featured = true
    if (featured === "false") filter.featured = false
    if (search) {
      filter.title = { $regex: search, $options: "i" }
    }

    const skip = (page - 1) * limit

    const [projects, total] = await Promise.all([
      PortfolioProject.find(filter)
        .sort({ featured: -1, displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PortfolioProject.countDocuments(filter),
    ])

    return NextResponse.json({
      projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[our-works GET]", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

    const existing = await PortfolioProject.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 })
    }

    const project = await PortfolioProject.create({ ...body, slug })
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("[our-works POST]", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
