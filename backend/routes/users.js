import express from "express";
import { authMiddleware, generateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Register new user
// Register new user
router.post("/register", async (req, res) => {
  try {
    console.log("=== REGISTRATION REQUEST ===");
    console.log("Body received:", req.body);

    const { email, password } = req.body; // Only get email and password

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Create user with email, password, and default cluster
    const newUser = new User({
      email,
      password,
      clusterId: "ncr_students", // Assign to default cluster
    });

    await newUser.save();
    console.log("User saved successfully:", {
      email: newUser.email,
      clusterId: newUser.clusterId,
      anonymousId: newUser.anonymousId,
    });

    // Generate token
    const token = generateToken(newUser._id);

    const userResponse = {
      _id: newUser._id,
      anonymousId: newUser.anonymousId,
      email: newUser.email,
      location: newUser.location, // Will be empty/default
      demographics: newUser.demographics, // Will be empty/default
      budget: newUser.budget, // Will be 0/default
      clusterId: newUser.clusterId, // Now has a cluster ID!
      trustScore: newUser.trustScore,
      token,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      anonymousId: user.anonymousId,
      email: user.email,
      location: user.location,
      demographics: user.demographics,
      budget: user.budget,
      clusterId: user.clusterId,
      trustScore: user.trustScore,
      token,
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user profile (protected route)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's cluster data
router.get("/:id/cluster", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // We'll implement cluster matching logic later
    res.json({ user, clusterData: null });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
