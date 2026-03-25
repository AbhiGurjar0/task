import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookie from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

export const userRegister = async (req, res) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    return res.json({ success: false, messages: ["Enter All Details"] });

  let isExist = await User.findOne({ email });
  if (isExist) {
    return res.json({ success: false, messages: "User Already Exist. Please Login" });
  }

  password = await bcrypt.hash(password, 10);

  let user = await User.create({ name, email, password, role });
  return res.json({ success: true, messages:"User Registered Successfully. Please Login" });

};

export const userLogin = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, messages: "Enter email and password"});
  }

  let user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, messages: "User does not exist. Please Register First!" });
  }

  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass) {
    return res.json({ success: false, messages: "Invalid enrollmentNumber or Password" });
  }

  let token = jwt.sign(
    { email: user.email, id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.json({
    success: true,
    messages: "User Logged In Successfully 🎉",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
