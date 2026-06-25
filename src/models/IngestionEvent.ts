import mongoose from "mongoose";

const ingestionEventSchema = new mongoose.Schema({
  sourceType: String,
  entityType: String,
  status: String,
  priority: String,
  source: String,
  division: String,
  service: String,
  location: String,
  entityId: String,
  entityModel: String,
  payload: mongoose.Schema.Types.Mixed,
  aiSummary: String,
  errorMessage: String,
  startedAt: Date,
  processedAt: Date,
}, { timestamps: true });

export default mongoose.models.IngestionEvent || mongoose.model("IngestionEvent", ingestionEventSchema);
