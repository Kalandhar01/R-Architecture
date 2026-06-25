import mongoose from "mongoose";

const architectureHeroSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  posterUrl: String,
  primaryCtaText: { type: String, default: "Start a Project" },
  primaryCtaHref: { type: String, default: "/contact" },
  secondaryCtaText: { type: String, default: "View Portfolio" },
  secondaryCtaHref: { type: String, default: "/projects" },
}, { timestamps: true });

export default mongoose.models.ArchitectureHero || mongoose.model("ArchitectureHero", architectureHeroSchema);
