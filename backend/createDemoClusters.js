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
      commonLocations: ["Manila", "Quezon City", "Makati"],
    },
  },
  {
    clusterId: "cebu_professionals",
    name: "Cebu Professionals",
    memberCount: 34,
    demographics: {
      avgBudget: 15000,
      commonSituations: ["professional"],
      commonLocations: ["Cebu City", "Mandaue", "Lapu-Lapu"],
    },
  },
  {
    clusterId: "davao_families",
    name: "Davao Families",
    memberCount: 23,
    demographics: {
      avgBudget: 8000,
      commonSituations: ["family"],
      commonLocations: ["Davao City", "Tagum", "Digos"],
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
    console.log("Demo clusters created successfully");

    // Verify
    const clusters = await Cluster.find();
    console.log("Current clusters in database:", clusters);

    process.exit(0);
  } catch (error) {
    console.error("Error creating demo clusters:", error);
    process.exit(1);
  }
}

createDemoClusters();
