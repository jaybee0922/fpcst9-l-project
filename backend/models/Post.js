import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  anonymousAuthorId: String, // "User #123"
  clusterId: String, // Author's cluster
  title: String,
  content: String,
  budget: Number,
  durationDays: Number, // How long budget lasted
  strategies: [String], // Strategies used
  location: {
    region: String,
    city: String,
  },
  ratings: [
    {
      userId: String,
      rating: Number, // 1-5 stars
      createdAt: { type: Date, default: Date.now },
    },
  ],
  avgRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  contentClusterId: String, // For content-based clustering
  createdAt: { type: Date, default: Date.now },
});

// Update average rating when new rating is added
postSchema.methods.updateRating = function () {
  if (this.ratings.length === 0) {
    this.avgRating = 0;
    this.ratingCount = 0;
  } else {
    const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.avgRating = total / this.ratings.length;
    this.ratingCount = this.ratings.length;
  }
};

export default mongoose.model("Post", postSchema);
