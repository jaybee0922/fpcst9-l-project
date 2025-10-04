import dotenv from "dotenv";
import mongoose from "mongoose";
import Cluster from "./models/Cluster.js";

dotenv.config();

const demoClusters = [
  {
    clusterId: "ncr_students",
    name: "NCR Students",
    memberCount: 47,
    demographics: {
      avgBudget: 3200,
      commonSituations: ["student"],
    },
    statistics: {
      avgTrustScore: 75,
      avgPostRating: 4.2,
      activeMemberCount: 35,
    },
  },
  {
    clusterId: "davao_families",
    name: "Davao Families",
    memberCount: 23,
    demographics: {
      avgBudget: 8000,
      commonSituations: ["family"],
    },
    statistics: {
      avgTrustScore: 82,
      avgPostRating: 4.5,
      activeMemberCount: 18,
    },
  },
  {
    clusterId: "cebu_professionals",
    name: "Cebu Professionals",
    memberCount: 34,
    demographics: {
      avgBudget: 15000,
      commonSituations: ["professional"],
    },
    statistics: {
      avgTrustScore: 88,
      avgPostRating: 4.3,
      activeMemberCount: 28,
    },
  },
];

async function createDemoClusters() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing clusters
    await Cluster.deleteMany({});
    console.log("Cleared existing clusters");

    // Create demo clusters
    await Cluster.insertMany(demoClusters);
    console.log("Demo clusters created successfully!");

    // List created clusters
    const clusters = await Cluster.find();
    console.log("\nCreated clusters:");
    clusters.forEach((cluster) => {
      console.log(`- ${cluster.name} (${cluster.memberCount} members)`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating demo clusters:", error);
    process.exit(1);
  }
}

createDemoClusters();
