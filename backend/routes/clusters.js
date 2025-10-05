import express from "express";
import Cluster from "../models/Cluster.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const clusters = await Cluster.find().sort({ memberCount: -1 });
    res.json(clusters);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:clusterId", async (req, res) => {
  try {
    const cluster = await Cluster.findOne({ clusterId: req.params.clusterId });

    if (!cluster) {
      return res.status(404).json({ error: "Cluster not found" });
    }

    const recentPosts = await Post.find({ clusterId: req.params.clusterId })
      .sort({ createdAt: -1 })
      .limit(10);

    const clusterMembers = await User.find({ clusterId: req.params.clusterId })
      .select("anonymousId demographics location budget")
      .limit(20);

    const clusterStats = await calculateClusterStats(req.params.clusterId);

    res.json({
      ...cluster.toObject(),
      recentPosts,
      clusterMembers,
      statistics: clusterStats,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/recommendations/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userCluster = await Cluster.findOne({ clusterId: user.clusterId });

    if (!userCluster) {
      return res.status(404).json({ error: "User cluster not found" });
    }

    const similarClusters = await Cluster.find({
      clusterId: { $ne: user.clusterId },
      "demographics.commonSituations": {
        $in: userCluster.demographics.commonSituations,
      },
    }).limit(3);

    const topClusterPosts = await Post.find({ clusterId: user.clusterId })
      .sort({ avgRating: -1 })
      .limit(5);

    res.json({
      userCluster,
      similarClusters,
      topPosts: topClusterPosts,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/:clusterId/insights", async (req, res) => {
  try {
    const clusterId = req.params.clusterId;

    const insights = await calculateClusterInsights(clusterId);
    res.json(insights);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post("/update-clusters", async (req, res) => {
  try {

    const { updateAllClusters } = await import(
      "../clustering/clusterService.js"
    );

    await updateAllClusters();
    res.json({ message: "Cluster update initiated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


const calculateClusterStats = async (clusterId) => {
  try {
    const users = await User.find({ clusterId });
    const posts = await Post.find({ clusterId });

    if (users.length === 0) {
      return {
        avgBudget: 0,
        avgDuration: 0,
        totalPosts: 0,
        avgPostRating: 0,
        activeMembers: 0,
      };
    }

    const avgBudget =
      users.reduce((sum, user) => sum + (user.budget || 0), 0) / users.length;

    const avgPostRating =
      posts.length > 0
        ? posts.reduce((sum, post) => sum + (post.avgRating || 0), 0) /
          posts.length
        : 0;

    return {
      avgBudget: Math.round(avgBudget),
      avgDuration: 12.3, 
      totalPosts: posts.length,
      avgPostRating: Math.round(avgPostRating * 10) / 10,
      activeMembers: users.length, 
    };
  } catch (error) {
    console.error("Error calculating cluster stats:", error);
    return {
      avgBudget: 0,
      avgDuration: 0,
      totalPosts: 0,
      avgPostRating: 0,
      activeMembers: 0,
    };
  }
};


const calculateClusterInsights = async (clusterId) => {
  const users = await User.find({ clusterId });
  const posts = await Post.find({ clusterId });


  const strategyCounts = {};
  users.forEach((user) => {
    user.strategies?.forEach((strategy) => {
      strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
    });
  });

  const topStrategies = Object.entries(strategyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([strategy, count]) => ({
      strategy,
      userCount: count,
      percentage: Math.round((count / users.length) * 100),
    }));


  const locationCounts = {};
  users.forEach((user) => {
    const location = user.location?.region || "Unknown";
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });


  const budgets = users
    .map((user) => user.budget || 0)
    .filter((budget) => budget > 0);
  const avgBudget =
    budgets.length > 0 ? budgets.reduce((a, b) => a + b) / budgets.length : 0;

  return {
    topStrategies,
    locationDistribution: locationCounts,
    budgetStats: {
      average: Math.round(avgBudget),
      min: Math.min(...budgets),
      max: Math.max(...budgets),
    },
    memberDemographics: {
      totalMembers: users.length,
      situations: countDemographics(users, "demographics.situation"),
      familySizes: countDemographics(users, "demographics.familySize"),
    },
  };
};

// Helper function to count demographic values
const countDemographics = (users, path) => {
  const counts = {};
  users.forEach((user) => {
    const value = getNestedValue(user, path);
    if (value !== undefined && value !== null) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  return counts;
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

export default router;
