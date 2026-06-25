import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  dedupeKey: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  message: String,
  project: String,
  division: String,
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  status: { type: String, enum: ["unread", "read", "archived"], default: "unread" },
  entity: String,
  entityId: String,
  actionUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
  adminId: String,
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
