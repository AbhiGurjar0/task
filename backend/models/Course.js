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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
courseModel.index({ courseName: "text" });

export default mongoose.model("Course", courseModel);
