import mongoose from "mongoose"

const portfolioProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    division: { type: String, required: true, index: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Upcoming"],
      default: "Ongoing",
    },
    coverImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true, collection: "portfolioprojects" }
)

portfolioProjectSchema.index({ slug: 1 })
portfolioProjectSchema.index({ division: 1, featured: -1, displayOrder: 1 })

export type PortfolioProjectDocument = mongoose.InferSchemaType<typeof portfolioProjectSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export default mongoose.models.PortfolioProject ||
  mongoose.model("PortfolioProject", portfolioProjectSchema, "portfolioprojects")
