import mongoose from "mongoose"

const ourWorkProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Architecture Works", "Construction Works"],
    },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Upcoming"],
      default: "Completed",
    },
    coverImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
)

ourWorkProjectSchema.index({ slug: 1 })
ourWorkProjectSchema.index({ category: 1 })
ourWorkProjectSchema.index({ featured: -1, position: 1 })

export type OurWorkProjectDocument = mongoose.InferSchemaType<typeof ourWorkProjectSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export default mongoose.models.OurWorkProject ||
  mongoose.model("OurWorkProject", ourWorkProjectSchema)
