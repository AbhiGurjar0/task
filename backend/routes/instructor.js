import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCourse,
  createAndAddModule,
} from "../services/instructorServices.js";

const router = express.Router();

router.post(
  "/create_course",
  isLoggedIn,
  isAuthorized("create:course"),
  createCourse,
);
router.post(
  "/add_module/:course_id",
  isLoggedIn,
  isAuthorized("create:module"),
  createAndAddModule,
);

export default router;
