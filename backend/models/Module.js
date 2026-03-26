import mongoose from "mongoose";

const moduleModel = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    orderIndex: { type: Number },
    moduleName: String,
    content: String,
  },
  { timestamps: true },
);

// Auto-increment orderIndex
moduleModel.pre("save", async function () {
if (this.orderIndex != null && this.orderIndex > 0) return;

  const lastModule = await this.constructor
    .findOne({ courseId: this.courseId })
    .sort({ orderIndex: -1 });

  this.orderIndex = lastModule ? lastModule.orderIndex + 1 : 1;
});

moduleModel.index({ courseId: 1, orderIndex: 1 }, { unique: true });

export default mongoose.model("Module", moduleModel);
