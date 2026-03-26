import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  getEnrolled,
  getCourseProgress,
  submitModule,
  getEnrollments
} from "../services/studentServices.js";

const router = express.Router();

router.post(
  "/enroll/:courseId",
  isLoggedIn,
  isAuthorized("enroll:course"),
  getEnrolled,
);

router.get(
  "/progress/:courseId",
  isLoggedIn,
  isAuthorized("view:progress"),
  getCourseProgress,
);

router.post(
  "/submit_module/:moduleId",
  isLoggedIn,
  isAuthorized("submit:module"),
  submitModule,
);
router.get("/my_enrollments",
  isLoggedIn,
  isAuthorized("view:enrollments"),
  getEnrollments

);


export default router;
