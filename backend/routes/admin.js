import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import  { getAllUsers, getAllCourses, getAllEnrollments, getAllProgress } from "../services/adminServices.js"

const router = express.Router();

router.get("/users", isLoggedIn, isAuthorized("view:users"), getAllUsers);

router.get(
  "/courses",
  isLoggedIn,
  isAuthorized("view:courses"),
  getAllCourses
);

router.get(
  "/enrollments",
  isLoggedIn,
  isAuthorized("view:enrollments"),
  getAllEnrollments,
);

router.get(
  "/progress",
  isLoggedIn,
  isAuthorized("view:progress"),
  getAllProgress,
);

export default router;
