import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  anonymousId: { type: String, unique: true }, 
  location: {
    region: String, 
    city: String, 
    province: String,
  },
  demographics: {
    situation: String, 
    familySize: Number,
    incomeLevel: Number, 
  },
  budget: Number, 
  spendingPriorities: [String], 
  strategies: [String], 
  clusterId: String,
  trustScore: { type: Number, default: 50 }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
