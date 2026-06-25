import mongoose from "mongoose";

const architecturePageViewSchema = new mongoose.Schema({
  path: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "ArchitectureProject" },
  projectSlug: String,
  referrer: String,
  userAgent: String,
  ipHash: String,
}, { timestamps: true });

export default mongoose.models.ArchitecturePageView || mongoose.model("ArchitecturePageView", architecturePageViewSchema);
