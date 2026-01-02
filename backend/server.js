
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./taskRoutes.js";

dotenv.config();
const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "https://task-tracker-backend-1-tfle.onrender.com";
app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());

app.use("/api/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running")
    );
  })
  .catch((err) => console.error(err));
