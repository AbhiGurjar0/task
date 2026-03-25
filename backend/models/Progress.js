import mongoose from "mongoose";

const progressModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  percentage: { type: Number, min: 0, max: 100 },
  completedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
});

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Progress", progressModel);
