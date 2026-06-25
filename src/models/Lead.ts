import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  division: String,
  fullName: String,
  email: String,
  phone: String,
  companyName: String,
  source: String,
  sourceType: String,
  service: String,
  location: String,
  status: { type: String, default: "new" },
  message: String,
  aiSummary: String,
  metadata: mongoose.Schema.Types.Mixed,
  ingestionEventId: { type: mongoose.Schema.Types.ObjectId, ref: "IngestionEvent" },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
