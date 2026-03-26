export const PERMISSIONS = {
  Admin: ["view:users", "view:courses", "view:progress", "view:enrollments"],

  Instructor: [
    "create:course",
    "edit:course",
    "delete:course",
    "delete:module",
    "view:courses",
    "create:module",
    "edit:module",
  ],

  Student: [
    "enroll:course",
    "submit:module",
    "view:courses",
    "view:progress",
    "view:enrollments",
  ],
};
