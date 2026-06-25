import mongoose from "mongoose";

const architectureLeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  projectType: { type: String, default: "Architecture consultation" },
  location: String,
  budget: String,
  message: String,
  sourcePage: String,
  status: { type: String, enum: ["new", "contacted", "converted", "qualified", "disqualified", "archived"], default: "new" },
  contactedAt: Date,
  convertedAt: Date,
  archivedAt: Date,
  contactInquiryId: String,
  legacyLeadId: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.models.ArchitectureLead || mongoose.model("ArchitectureLead", architectureLeadSchema);
