import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  anonymousAuthorId: String,
  clusterId: String,
  title: String,
  content: String,
  budget: Number,
  durationDays: Number,
  region: String,
  userType: String,
  householdSize: Number,
  strategies: [String],
  location: {
    region: String,
    city: String,
  },
  ratings: [
    {
      userId: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  avgRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  contentClusterId: String,
  createdAt: { type: Date, default: Date.now },
});

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
