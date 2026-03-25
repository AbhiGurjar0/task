import mongoose from "mongoose";

const enrollmentModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  enrolledAt: { type: Date, default: Date.now },
  
});

enrollmentSchema.index({ userId: 1 });

export default mongoose.model("Enrollment",enrollmentModel)