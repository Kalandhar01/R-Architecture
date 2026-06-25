import { v2 as cloudinary } from "cloudinary"
import fs from "node:fs"
import path from "node:path"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const FOLDER = "ractysh-architecture/our-works"

export async function uploadImage(filePath: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: FOLDER,
    resource_type: "image",
    quality: "auto:best",
    fetch_format: "auto",
    transformation: [
      { width: 1920, height: 1080, crop: "limit", quality: "auto", fetch_format: "auto" },
    ],
  })
  return result.secure_url
}

export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        public_id: filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-"),
        resource_type: "image",
        quality: "auto:best",
        fetch_format: "auto",
        transformation: [
          { width: 1920, height: 1080, crop: "limit", quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )
    stream.end(buffer)
  })
}

export async function uploadAllFromFolder(localFolder: string): Promise<string[]> {
  const files = fs.readdirSync(localFolder).filter((f) => {
    const ext = path.extname(f).toLowerCase()
    return [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)
  })

  const urls: string[] = []
  for (const file of files) {
    const filePath = path.join(localFolder, file)
    const url = await uploadImage(filePath)
    urls.push(url)
  }
  return urls
}

export function deleteImage(publicUrl: string) {
  const publicId = publicUrl
    .split("/")
    .slice(-2)
    .join("/")
    .replace(/\.[^.]+$/, "")
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary
