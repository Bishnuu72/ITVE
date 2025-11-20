import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  metaTitle: { type: String },
  metaKeyword: { type: String },
  metaDescription: { type: String },
  shortDescription: { type: String },
  longDescription: { type: String },
  banner: { type: String }, // store file path or URL
  featuredImage: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);
export default Page;