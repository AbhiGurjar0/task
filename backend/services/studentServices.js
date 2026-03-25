import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Progress from "../models/Progress.js";
import Enrollment from "../models/Enrollment.js";

const getEnrolled = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      userId: studentId,
      courseId: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      userId: studentId,
      courseId: courseId,
      enrolledAt: Date.now(),
    });

    const progress = await Progress.create({
      userId: studentId,
      courseId: courseId,
      percentage: 0,
      completedModules: [],
      isCompleted: false,
    });

    return res.status(201).json({
      success: true,
      message: `Successfully enrolled in ${course.courseName}`,
      enrollment: {
        enrollmentId: enrollment._id,
        courseId: courseId,
        courseName: course.courseName,
        enrolledAt: enrollment.enrolledAt,
      },
      progress: {
        progressId: progress._id,
        percentage: 0,
        isCompleted: false,
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

const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const targetUserId = req.user.id;

    // enrollment exists or not
    const enrollment = await Enrollment.findOne({
      userId: targetUserId,
      courseId: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "No enrollment found for this course.",
      });
    }

    // getting progress details
    const progress = await Progress.findOne({
      userId: targetUserId,
      courseId: courseId,
    }).populate("completedModules", "moduleName orderIndex");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found.",
      });
    }

    // total modules available
    const course = await Course.findById(courseId).populate(
      "modules",
      "moduleName orderIndex",
    );

    const totalModules = course.modules.length;
    const completedCount = progress.completedModules.length;

    return res.status(200).json({
      success: true,
      progress: {
        courseId: courseId,
        courseName: course.courseName,
        percentage: progress.percentage,
        isCompleted: progress.isCompleted,
        totalModules: totalModules,
        completedModules: completedCount,
        remaining: totalModules - completedCount,
        modules: {
          completed: progress.completedModules,
          all: course.modules,
        },
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

const submitModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.id;
    console.log(studentId);
    console.log(moduleId);

    // checking module is exists or not
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }
    console.log(module);

    const courseId = module.courseId;
    console.log(courseId.toString());
    // checking user is enrolled or not
    const enrollment = await Enrollment.findOne({
      userId: studentId,
      courseId: courseId.toString(),
    });
    console.log(enrollment);

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    // cheking user and course entry in progress
    let progress = await Progress.findOne({
      userId: studentId,
      courseId: courseId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found.",
      });
    }
    //module completion
    const alreadyDone = progress.completedModules
      .map((id) => id.toString())
      .includes(moduleId.toString());

    if (alreadyDone) {
      return res.status(400).json({
        success: false,
        message: "You have already completed this module.",
      });
    }
    progress.completedModules.push(moduleId);

    //calculating the percentge
    const course = await Course.findById(courseId);
    const totalModules = course.modules.length;
    const completed = progress.completedModules.length;

    progress.percentage = Math.round((completed / totalModules) * 100);

    if (completed === totalModules) {
      progress.isCompleted = true;
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: progress.isCompleted
        ? "Module completed! You have finished the course!"
        : `Module completed! Progress: ${progress.percentage}%`,
      progress: {
        percentage: progress.percentage,
        isCompleted: progress.isCompleted,
        completedCount: completed,
        totalModules: totalModules,
        remaining: totalModules - completed,
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

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate("courseId", "courseName createdBy")
      .sort({ enrolledAt: -1 });

    // attach progress to each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await Progress.findOne({
          userId: req.user._id,
          courseId: enrollment.courseId._id,
        }).select("percentage isCompleted completedModules");

        return {
          _id: enrollment._id,
          course: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt,
          progress: {
            percentage: progress?.percentage || 0,
            isCompleted: progress?.isCompleted || false,
            modulesdone: progress?.completedModules?.length || 0,
          },
        };
      }),
    );

    return res.status(200).json({
      success: true,
      total: enrollments.length,
      enrollments: enrollmentsWithProgress,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export { getEnrolled, getCourseProgress, submitModule ,getEnrollments};
