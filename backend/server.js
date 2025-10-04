import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";

// Routes
import clusterRoutes from "./routes/clusters.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

// Services
import { updateAllClusters } from "./clustering/clusterService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/clusters", clusterRoutes);

// Schedule clustering updates 
cron.schedule(process.env.CLUSTER_UPDATE_SCHEDULE, () => {
  console.log("Running scheduled cluster update...");
  updateAllClusters();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
