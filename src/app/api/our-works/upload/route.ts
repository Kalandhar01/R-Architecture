import { NextRequest, NextResponse } from "next/server"
import { uploadImageBuffer } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadImageBuffer(buffer, file.name)

    return NextResponse.json({ url: result.url, publicId: result.publicId })
  } catch (error) {
    console.error("[our-works/upload POST]", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
