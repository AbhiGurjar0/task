import mongoose from "mongoose";

const moduleModel = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    orderIndex: { type: Number },
    module_name: String,
    content: String,
  },
  { timestamps: true },
);

export default mongoose.model("Module", moduleModel);
