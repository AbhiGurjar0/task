import mongoose from "mongoose";

const progressModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  percentage: { type: Number, min: 0, max: 100, default: 0 },
  completedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
});

progressModel.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("Progress", progressModel);
