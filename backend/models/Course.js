import mongoose from "mongoose";

const courseModel = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Course",courseModel)