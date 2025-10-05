import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Create new post
router.post("/", async (req, res) => {
  try {
    const {
      anonymousAuthorId,
      clusterId,
      title,
      content,
      budget,
      durationDays,
      region,
      userType,
      householdSize,
      strategies,
      location,
    } = req.body;

    const newPost = new Post({
      anonymousAuthorId,
      clusterId,
      title,
      content,
      budget,
      durationDays,
      region,
      userType,
      householdSize,
      strategies,
      location,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rate a post
router.post("/:id/rate", async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const post = await Post.findById(req.params.id);

    // Remove existing rating from this user
    post.ratings = post.ratings.filter((r) => r.userId !== userId);

    // Add new rating
    post.ratings.push({ userId, rating });
    post.updateRating();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get posts for a cluster
router.get("/cluster/:clusterId", async (req, res) => {
  try {
    const posts = await Post.find({ clusterId: req.params.clusterId }).sort({
      avgRating: -1,
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
