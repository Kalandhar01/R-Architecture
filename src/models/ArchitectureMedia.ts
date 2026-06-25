import mongoose from "mongoose";

const architectureMediaSchema = new mongoose.Schema({
  kind: { type: String, required: true },
  title: { type: String, required: true },
  altText: String,
  url: { type: String, required: true },
  provider: { type: String, default: "cloudinary" },
  mimeType: String,
  size: Number,
  usage: { type: String, default: "portfolio" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "ArchitectureProject" },
}, { timestamps: true });

export default mongoose.models.ArchitectureMedia || mongoose.model("ArchitectureMedia", architectureMediaSchema);
