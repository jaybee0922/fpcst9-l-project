import express from "express";
import { authMiddleware, generateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    console.log("=== REGISTRATION REQUEST ===");
    console.log("Body received:", req.body);

    const { email, password } = req.body; 


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }


    const newUser = new User({
      email,
      password,
      clusterId: "ncr_students", 
    });

    await newUser.save();
    console.log("User saved successfully:", {
      email: newUser.email,
      clusterId: newUser.clusterId,
      anonymousId: newUser.anonymousId,
    });


    const token = generateToken(newUser._id);

    const userResponse = {
      _id: newUser._id,
      anonymousId: newUser.anonymousId,
      email: newUser.email,
      location: newUser.location, 
      demographics: newUser.demographics, 
      budget: newUser.budget, 
      clusterId: newUser.clusterId, 
      trustScore: newUser.trustScore,
      token,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

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

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id/cluster", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user, clusterData: null });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
