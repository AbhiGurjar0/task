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

export { createCourse, createAndAddModule };
