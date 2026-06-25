import mongoose from "mongoose";

const architectureProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: String,
  location: String,
  projectType: String,
  year: String,
  area: String,
  status: { type: String, default: "concept" },
  coverImage: String,
  coverImageAlt: String,
  galleryImages: [String],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  position: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.ArchitectureProject || mongoose.model("ArchitectureProject", architectureProjectSchema);
