import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import PortfolioProject from "@/models/OurWorkProject"
import { deleteImage } from "@/lib/cloudinary"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const project = await PortfolioProject.findById(id).lean()
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("[our-works/:id GET]", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const body = await request.json()

    const project = await PortfolioProject.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("[our-works/:id PUT]", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const project = await PortfolioProject.findById(id).lean() as Record<string, unknown> | null
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const images: string[] = [project.coverImage as string, ...((project.galleryImages as string[]) || [])].filter(Boolean) as string[]
    await Promise.allSettled(images.map((url: string) => deleteImage(url)))

    await PortfolioProject.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[our-works/:id DELETE]", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
