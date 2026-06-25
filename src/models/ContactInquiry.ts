import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema({
  division: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  service: String,
  subject: String,
  message: { type: String, required: true },
  sourcePage: String,
  status: { type: String, default: "new" },
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.models.ContactInquiry || mongoose.model("ContactInquiry", contactInquirySchema);
