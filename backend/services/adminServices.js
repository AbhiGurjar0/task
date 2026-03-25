import Course from "../models/Course.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Enrollment from "../models/Enrollment.js";

const getAllUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name email")
      .populate("modules", "moduleName")
      .sort({ createdAt: -1 });

    // add enrollment count to each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({
          courseId: course._id,
        });
        return {
          ...course.toObject(),
          enrollmentCount,
          moduleCount: course.modules.length,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      total: courses.length,
      courses: coursesWithStats,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const filter = {};

    // filter by course
    if (req.query.courseId) filter.courseId = req.query.courseId;

    // filter by student
    if (req.query.userId) filter.userId = req.query.userId;

    const enrollments = await Enrollment.find(filter)
      .populate("userId", "name email role")
      .populate("courseId", "courseName")
      .sort({ enrolledAt: -1 });

    return res.status(200).json({
      success: true,
      total: enrollments.length,
      enrollments,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllProgress = async (req, res) => {
  try {
    const filter = {};

    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.isCompleted !== undefined) {
      filter.isCompleted = req.query.isCompleted === "true";
    }

    const allProgress = await Progress.find(filter)
      .populate("userId", "name email")
      .populate("courseId", "courseName")
      .populate("completedModules", "moduleName")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      total: allProgress.length,
      progress: allProgress,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export { getAllUsers, getAllCourses, getAllEnrollments, getAllProgress };
