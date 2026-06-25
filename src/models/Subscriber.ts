import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  source: String,
  division: { type: String, default: "architecture" },
  status: { type: String, default: "active" },
}, { timestamps: true });

export default mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
