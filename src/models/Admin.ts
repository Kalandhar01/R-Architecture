import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imageUrl: String,
  passwordHash: String,
  googleId: String,
  active: { type: Boolean, default: true },
  lastLoginAt: Date,
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
