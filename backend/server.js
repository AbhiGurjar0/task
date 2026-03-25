import express from "express";
import conectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";

//routes
import student from "./routes/student.js";
import instructor from "./routes/instructor.js";
import admin from "./routes/admin.js";

//controller 
import { userLogin, userRegister } from "./controllers/auth.js";

// env  + db connection
dotenv.config();
conectDB();
const app = express();

//middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5171"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "5mb" }));

//test Route
app.get("/", (req, res) => {
  res.send("Working...");
});

//Authentication
app.post("/login", userLogin);
app.post("/register", userRegister);

//routes
app.use("/student", student);
app.use("/instructor", instructor);
app.use("/admin", admin);

app.listen(3000, () => {
  console.log("Server Running... ");
});
