// Similarity calculation functions for hierarchical clustering

/**
 * Calculate Euclidean distance between two feature vectors
 */
export const euclideanDistance = (vector1, vector2) => {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must have the same length");
  }

  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
};

/**
 * Calculate cosine similarity between two vectors
 * Returns value between 0 (completely different) and 1 (identical)
 */
export const cosineSimilarity = (vector1, vector2) => {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += Math.pow(vector1[i], 2);
    magnitude2 += Math.pow(vector2[i], 2);
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Calculate similarity between two users based on their profiles
 */
export const userSimilarity = (user1, user2) => {
  const weights = {
    budget: 0.3,
    location: 0.25,
    demographics: 0.25,
    priorities: 0.1,
    strategies: 0.1,
  };

  let totalSimilarity = 0;

  // Budget similarity (normalized difference)
  const budgetDiff = Math.abs((user1.budget || 3000) - (user2.budget || 3000));
  const maxBudget = Math.max(user1.budget || 3000, user2.budget || 3000, 1);
  const budgetSimilarity = 1 - budgetDiff / maxBudget;
  totalSimilarity += budgetSimilarity * weights.budget;

  // Location similarity
  const locationSimilarity = calculateLocationSimilarity(
    user1.location,
    user2.location
  );
  totalSimilarity += locationSimilarity * weights.location;

  // Demographics similarity
  const demoSimilarity = calculateDemographicSimilarity(
    user1.demographics,
    user2.demographics
  );
  totalSimilarity += demoSimilarity * weights.demographics;

  // Spending priorities similarity (Jaccard index)
  const priorities1 = user1.spendingPriorities || [];
  const priorities2 = user2.spendingPriorities || [];
  const prioritySimilarity = calculateJaccardSimilarity(
    priorities1,
    priorities2
  );
  totalSimilarity += prioritySimilarity * weights.priorities;

  // Strategies similarity (Jaccard index)
  const strategies1 = user1.strategies || [];
  const strategies2 = user2.strategies || [];
  const strategySimilarity = calculateJaccardSimilarity(
    strategies1,
    strategies2
  );
  totalSimilarity += strategySimilarity * weights.strategies;

  return totalSimilarity;
};

/**
 * Calculate location similarity between two users
 */
const calculateLocationSimilarity = (loc1, loc2) => {
  if (!loc1 || !loc2) return 0.5;

  let similarity = 0;

  
  if (loc1.region === loc2.region) {
    similarity += 0.6;
  } else {
    const island1 = getIslandGroup(loc1.region);
    const island2 = getIslandGroup(loc2.region);
    if (island1 === island2) {
      similarity += 0.3;
    }
  }

  if (loc1.city === loc2.city) {
    similarity += 0.4;
  }

  return Math.min(similarity, 1);
};

/**
 * Group regions by island for broader similarity
 */
const getIslandGroup = (region) => {
  const luzonRegions = [
    "NCR",
    "Region I",
    "Region II",
    "Region III",
    "Region IV-A",
    "Region IV-B",
    "Region V",
    "CAR",
  ];
  const visayasRegions = ["Region VI", "Region VII", "Region VIII"];
  const mindanaoRegions = [
    "Region IX",
    "Region X",
    "Region XI",
    "Region XII",
    "ARMM",
  ];

  if (luzonRegions.includes(region)) return "luzon";
  if (visayasRegions.includes(region)) return "visayas";
  if (mindanaoRegions.includes(region)) return "mindanao";
  return "unknown";
};

/**
 * Calculate demographic similarity
 */
const calculateDemographicSimilarity = (demo1, demo2) => {
  if (!demo1 || !demo2) return 0.5;

  let similarity = 0;

  if (demo1.situation === demo2.situation) {
    similarity += 0.6;
  }

  const size1 = demo1.familySize || 1;
  const size2 = demo2.familySize || 1;
  const sizeDiff = Math.abs(size1 - size2);
  const maxSize = Math.max(size1, size2, 1);
  const sizeSimilarity = 1 - sizeDiff / maxSize;
  similarity += sizeSimilarity * 0.4;

  return Math.min(similarity, 1);
};

/**
 * Calculate Jaccard similarity between two arrays
 * Returns the intersection over union
 */
const calculateJaccardSimilarity = (array1, array2) => {
  if (array1.length === 0 && array2.length === 0) return 1;

  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
};

/**
 * Calculate distance matrix for all users
 * Used for hierarchical clustering
 */
export const calculateDistanceMatrix = (users) => {
  const n = users.length;
  const matrix = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const similarity = userSimilarity(users[i], users[j]);
      const distance = 1 - similarity;
      matrix[i][j] = distance;
      matrix[j][i] = distance;
    }
  }

  return matrix;
};

/**
 * Normalize feature vectors for better clustering
 */
export const normalizeFeatures = (features) => {
  if (features.length === 0) return features;

  const numFeatures = features[0].length;
  const normalized = [];

  const mins = Array(numFeatures).fill(Infinity);
  const maxs = Array(numFeatures).fill(-Infinity);

  features.forEach((featureVector) => {
    featureVector.forEach((value, index) => {
      mins[index] = Math.min(mins[index], value);
      maxs[index] = Math.max(maxs[index], value);
    });
  });

  features.forEach((featureVector) => {
    const normalizedVector = featureVector.map((value, index) => {
      const range = maxs[index] - mins[index];
      if (range === 0) return 0.5;
      return (value - mins[index]) / range;
    });
    normalized.push(normalizedVector);
  });

  return normalized;
};

/**
 * Find most similar users to a target user
 */
export const findSimilarUsers = (targetUser, allUsers, limit = 5) => {
  const similarities = allUsers
    .filter((user) => user._id.toString() !== targetUser._id.toString())
    .map((user) => ({
      user,
      similarity: userSimilarity(targetUser, user),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities;
};

export default {
  euclideanDistance,
  cosineSimilarity,
  userSimilarity,
  calculateDistanceMatrix,
  normalizeFeatures,
  findSimilarUsers,
};
