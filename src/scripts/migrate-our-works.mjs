import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUR_WORKS_DIR = path.resolve(__dirname, "../../public/images/our-works")

const categoryMap = {
  "Backery- City Corner": "Architecture Works",
  "Bedroom": "Architecture Works",
  "Home-Interiore works": "Architecture Works",
  "Ragu Durai Residence interior": "Architecture Works",
  "Raja Thanga Maaligai": "Architecture Works",
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function generateTitle(folderName) {
  return folderName
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is required")
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log("Connected to MongoDB")

  const schema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    category: String,
    description: String,
    location: String,
    status: { type: String, default: "Completed" },
    coverImage: String,
    galleryImages: [String],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    position: Number,
  }, { timestamps: true })

  const OurWorkProject = mongoose.models.OurWorkProject ||
    mongoose.model("OurWorkProject", schema)

  const entries = fs.readdirSync(OUR_WORKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())

  if (entries.length === 0) {
    console.log("No project folders found in public/images/our-works/")
    await mongoose.disconnect()
    return
  }

  let created = 0
  let skipped = 0

  for (const [index, entry] of entries.entries()) {
    const folderName = entry.name
    const folderPath = path.join(OUR_WORKS_DIR, folderName)

    const files = fs.readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort()

    if (files.length === 0) {
      console.log(`  ${folderName}: no image files, skipping`)
      continue
    }

    const title = generateTitle(folderName)
    const slug = slugify(title)

    const existing = await OurWorkProject.findOne({ slug })
    if (existing) {
      console.log(`  ${folderName}: already exists, skipping`)
      skipped++
      continue
    }

    const imagePaths = files.map((f) => {
      const relativeFolder = folderName.replace(/['']/g, "").replace(/\s+/g, "-")
      return `/images/our-works/${folderName}/${f}`
    })

    const category = categoryMap[folderName] || "Architecture Works"

    await OurWorkProject.create({
      title,
      slug,
      category,
      description: `${title} — A curated architectural project by Ractysh Architecture.`,
      location: "",
      status: "Completed",
      coverImage: imagePaths[0],
      galleryImages: imagePaths,
      featured: index < 2,
      published: true,
      position: index,
    })

    console.log(`  ${folderName}: ${files.length} images → MongoDB record created`)
    created++
  }

  await mongoose.disconnect()
  console.log(`\nMigration complete! ${created} created, ${skipped} skipped`)
}

migrate().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
