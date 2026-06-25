import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import OurWorkProject from "@/models/OurWorkProject"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const slug = searchParams.get("slug")

    if (slug) {
      const project = await OurWorkProject.findOne({ slug }).lean()
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      return NextResponse.json({ project })
    }

    const filter: Record<string, unknown> = {}
    if (category && category !== "All") filter.category = category

    const projects = await OurWorkProject.find(filter)
      .sort({ featured: -1, position: 1, createdAt: -1 })
      .lean()

    return NextResponse.json({ projects })
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

    const existing = await OurWorkProject.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 })
    }

    const project = await OurWorkProject.create({ ...body, slug })
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("[our-works POST]", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
