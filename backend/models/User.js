import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Generate anonymous ID if not exists
    if (!this.anonymousId) {
      const userCount = await mongoose.model("User").countDocuments();
      this.anonymousId = `User #${userCount + 1}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
