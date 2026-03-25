import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCourse,
  createAndAddModule,
  deleteModule,
  editCourse,
  deleteCourse,
  editModule,
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
router.put(
  "/module/:id",
  isLoggedIn,
  isAuthorized("edit:module"),
  editModule,
);
router.put(
  "/course/:id",
  isLoggedIn,
  isAuthorized("edit:course"),
  editCourse,
);
router.delete(
  "/module/:id",
  isLoggedIn,
  isAuthorized("delete:module"),
  deleteModule,
);
router.delete(
  "/course/:id",
  isLoggedIn,
  isAuthorized("delete:course"),
  deleteCourse,
);

export default router;
