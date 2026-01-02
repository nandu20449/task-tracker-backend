
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
