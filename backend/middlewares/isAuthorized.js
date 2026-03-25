import jwt from "jsonwebtoken";
import { PERMISSIONS } from "../config/permission.js";
import User from "../models/User.js";

export const isAuthorized = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const role = req.user.role;

      const rolePermissions = PERMISSIONS[role];

      if (!rolePermissions) {
        return res.status(403).json({
          success: false,
          message: `Unknown role: ${role}`,
        });
      }

      const hasPermission = rolePermissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Role '${role}' cannot perform '${requiredPermission}'`,
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Authorization error.",
      });
    }
  };
};
