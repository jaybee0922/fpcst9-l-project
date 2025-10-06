import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  anonymousId: { type: String, unique: true },
  location: {
    region: String,
    city: String,
    province: String,
  },
  demographics: {
    situation: String,
    familySize: Number,
    incomeLevel: Number,
  },
  budget: Number,
  spendingPriorities: [String],
  strategies: [String],
  clusterId: String,
  trustScore: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    if (!this.anonymousId) {
      const userCount = await mongoose.model("User").countDocuments();
      this.anonymousId = `User #${userCount + 1}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
