import Course from "../models/Course.js";
import Module from "../models/Module.js";

const createCourse = async (req, res) => {
  let { courseName } = req.body;
  if (!courseName) {
    return res.status(400).json({
      success: false,
      message: "CourseName is  required.",
    });
  }

  let course = await Course.create({
    courseName,
    createdBy: req.user.id,
  });
  return res.json({
    success: "True",
    message: "Course Created Successfully ",
    courseDetails: {
      courseName: courseName,
      createdBy: req.user.id,
    },
  });
};

const createAndAddModule = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { moduleName, content, orderIndex } = req.body;

    if (!moduleName || !content) {
      return res.status(400).json({
        success: false,
        message: "moduleName and content are required.",
      });
    }

    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (
      req.user.role === "Instructor" &&
      course.createdBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only add modules to your own course.",
      });
    }
    const newModule = await Module.create({
      courseId: course_id,
      moduleName: moduleName,
      content: content,
      orderIndex: orderIndex || 0,
    });

    const updatedCourse = await Course.findByIdAndUpdate(course_id, {
      $addToSet: { modules: newModule._id },
    }).populate("modules");
    await updatedCourse.save();

    return res.status(201).json({
      success: true,
      message: "Module added successfully.",
      module: newModule,
      course: {
        courseName: updatedCourse.courseName,
        totalModules: updatedCourse.modules.length,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message,
    });
  }
};
const editModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    // check course ownership — is this their course?
    const course = await Course.findById(module.courseId);
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit modules of your own course.",
      });
    }

    const { moduleName, content, orderIndex } = req.body;

    const updated = await Module.findByIdAndUpdate(
      req.params.id,
      { moduleName, content, orderIndex },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Module updated.",
      module: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
const editCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // ownership check — only their own course
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own course.",
      });
    }

    const { courseName } = req.body;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Course updated.",
      course: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    // ownership check via course
    const course = await Course.findById(module.courseId);
    if (
      req.user.role === "Instructor" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete modules of your own course.",
      });
    }

    // remove from course.modules array too
    await Course.findByIdAndUpdate(
      module.courseId,
      { $pull: { modules: module._id } }, // $pull removes from array
    );

    await Module.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Module "${module.moduleName}" deleted.`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // instructor can only delete their own — admin can delete any
    if (
      req.user.role === "Instructor" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own course.",
      });
    }

    // clean up everything related
    await Module.deleteMany({ courseId: course._id });
    await Enrollment.deleteMany({ courseId: course._id });
    await Progress.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Course "${course.courseName}" deleted.`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export {
  createCourse,
  createAndAddModule,
  deleteModule,
  editCourse,
  deleteCourse,
  editModule,
};
