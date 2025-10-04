import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  anonymousId: { type: String, unique: true }, // "User #123"
  location: {
    region: String, // "NCR", "Region XI", etc.
    city: String, // "Manila", "Davao", "Cebu"
    province: String,
  },
  demographics: {
    situation: String, // "student", "professional", "family"
    familySize: Number,
    incomeLevel: Number, // 1-5 scale
  },
  budget: Number, // ₱3000, ₱5000, etc.
  spendingPriorities: [String], // ["food", "transport", "school"]
  strategies: [String], // ["carenderia", "jeepney", "palengke"]
  clusterId: String, // Which cluster they belong to ← MAKE SURE THIS EXISTS
  trustScore: { type: Number, default: 50 }, // 0-100
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
