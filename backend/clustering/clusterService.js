import Cluster from "../models/Cluster.js";
import User from "../models/User.js";

// Simple hierarchical clustering implementation
export const updateAllClusters = async () => {
  try {
    console.log("Starting hierarchical clustering...");

    // Get all users with their data
    const users = await User.find();

    if (users.length < 5) {
      console.log("Not enough users for clustering (need at least 5)");
      return;
    }

    // Use our simple clustering logic
    const userClusters = await simpleHierarchicalClustering(users);

    // Save cluster data
    await saveClusters(userClusters);

    console.log(
      `Clustering completed. Created ${userClusters.length} clusters`
    );
  } catch (error) {
    console.error("Clustering error:", error);
    // Fallback to basic grouping if clustering fails
    await fallbackClustering();
  }
};

// Simple hierarchical clustering implementation
const simpleHierarchicalClustering = async (users) => {
  // Step 1: Start with each user as their own cluster
  let clusters = users.map((user) => ({
    users: [user],
    centroid: calculateUserVector(user),
  }));

  // Step 2: Merge closest clusters until we have reasonable groups
  const targetClusterCount = Math.max(
    3,
    Math.min(10, Math.floor(users.length / 5))
  );

  while (clusters.length > targetClusterCount) {
    // Find two closest clusters
    let minDistance = Infinity;
    let clusterA = null;
    let clusterB = null;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const distance = calculateClusterDistance(clusters[i], clusters[j]);
        if (distance < minDistance) {
          minDistance = distance;
          clusterA = i;
          clusterB = j;
        }
      }
    }

    // Merge the two closest clusters
    if (clusterA !== null && clusterB !== null) {
      const mergedUsers = [
        ...clusters[clusterA].users,
        ...clusters[clusterB].users,
      ];
      clusters[clusterA] = {
        users: mergedUsers,
        centroid: calculateCentroid(mergedUsers),
      };
      clusters.splice(clusterB, 1);
    } else {
      break;
    }
  }

  // Convert to our cluster format
  return clusters.map((cluster, index) => ({
    clusterId: `cluster_${index + 1}`,
    name: generateClusterName(cluster.users),
    members: cluster.users,
    memberCount: cluster.users.length,
    demographics: calculateClusterDemographics(cluster.users),
  }));
};

// Calculate feature vector for a user
const calculateUserVector = (user) => {
  return [
    user.budget || 3000,
    locationToCode(user.location?.region || "NCR"),
    demographicToCode(user.demographics?.situation || "student"),
    user.demographics?.familySize || 1,
    priorityScore(user.spendingPriorities || []),
    strategyScore(user.strategies || []),
  ];
};

// Calculate centroid (average) of multiple users
const calculateCentroid = (users) => {
  if (users.length === 0) return [];

  const vectors = users.map(calculateUserVector);
  const centroid = [];

  for (let i = 0; i < vectors[0].length; i++) {
    const sum = vectors.reduce((total, vector) => total + vector[i], 0);
    centroid.push(sum / vectors.length);
  }

  return centroid;
};

// Calculate distance between two clusters
const calculateClusterDistance = (clusterA, clusterB) => {
  // Simple Euclidean distance between centroids
  let sum = 0;
  for (let i = 0; i < clusterA.centroid.length; i++) {
    sum += Math.pow(clusterA.centroid[i] - clusterB.centroid[i], 2);
  }
  return Math.sqrt(sum);
};

// Helper functions (keep these from before)
const locationToCode = (region) => {
  const regions = [
    "NCR",
    "Region I",
    "Region II",
    "Region III",
    "Region IV-A",
    "Region IV-B",
    "Region V",
    "Region VI",
    "Region VII",
    "Region VIII",
    "Region IX",
    "Region X",
    "Region XI",
    "Region XII",
    "CAR",
    "ARMM",
  ];
  const index = regions.indexOf(region);
  return index >= 0 ? index + 1 : 1;
};

const demographicToCode = (situation) => {
  const situations = ["student", "professional", "family", "senior", "other"];
  const index = situations.indexOf(situation);
  return index >= 0 ? index + 1 : 1;
};

const priorityScore = (priorities) => {
  const priorityWeights = {
    food: 1,
    transport: 2,
    school: 3,
    savings: 4,
    leisure: 5,
  };
  return priorities.reduce(
    (score, priority) => score + (priorityWeights[priority] || 0),
    0
  );
};

const strategyScore = (strategies) => {
  const strategyWeights = {
    carenderia: 1,
    jeepney: 2,
    palengke: 3,
    walking: 4,
    cooking: 5,
  };
  return strategies.reduce(
    (score, strategy) => score + (strategyWeights[strategy] || 0),
    0
  );
};

const generateClusterName = (members) => {
  if (members.length === 0) return "Unknown Cluster";

  const commonLocation = getMostCommon(members.map((m) => m.location?.region));
  const commonSituation = getMostCommon(
    members.map((m) => m.demographics?.situation)
  );

  return `${commonLocation} ${commonSituation}s`;
};

const getMostCommon = (array) => {
  return array.reduce(
    (a, b, i, arr) =>
      arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
        ? a
        : b,
    array[0]
  );
};

const calculateClusterDemographics = (members) => {
  const avgBudget =
    members.reduce((sum, user) => sum + (user.budget || 0), 0) / members.length;
  const commonSituations = getMostCommon(
    members.map((m) => m.demographics?.situation)
  );

  return {
    avgBudget: Math.round(avgBudget),
    commonSituations: [commonSituations],
  };
};

const saveClusters = async (clusters) => {
  for (const clusterData of clusters) {
    await Cluster.findOneAndUpdate(
      { clusterId: clusterData.clusterId },
      {
        clusterId: clusterData.clusterId,
        name: clusterData.name,
        memberCount: clusterData.memberCount,
        demographics: clusterData.demographics,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
  }
};

// Fallback clustering if main method fails
const fallbackClustering = async () => {
  console.log("Using fallback clustering...");
  const users = await User.find();

  const groups = {};

  users.forEach((user) => {
    const region = user.location?.region || "Unknown";
    const situation = user.demographics?.situation || "unknown";
    const key = `${region}_${situation}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(user);
  });

  const clusters = Object.entries(groups).map(([key, members]) => ({
    clusterId: key.toLowerCase().replace(/ /g, "_"),
    name: key.replace("_", " "),
    members,
    memberCount: members.length,
    demographics: calculateClusterDemographics(members),
  }));

  await saveClusters(clusters);
};

export default {
  updateAllClusters,
};
