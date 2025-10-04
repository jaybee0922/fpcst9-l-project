import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create new user
router.post("/register", async (req, res) => {
  try {
    const { location, demographics, budget, spendingPriorities, strategies } =
      req.body;

    // Generate anonymous ID
    const userCount = await User.countDocuments();
    const anonymousId = `User #${userCount + 1}`;

    const newUser = new User({
      anonymousId,
      location,
      demographics,
      budget,
      spendingPriorities,
      strategies,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
