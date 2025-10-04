import mongoose from "mongoose";

const clusterSchema = new mongoose.Schema({
  clusterId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  memberCount: {
    type: Number,
    default: 0,
  },
  demographics: {
    avgBudget: Number,
    commonSituations: [String],
    commonLocations: [String],
  },
  statistics: {
    avgTrustScore: Number,
    avgPostRating: Number,
    activeMemberCount: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Cluster", clusterSchema);
