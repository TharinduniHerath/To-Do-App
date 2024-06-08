const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ToDo", toDoSchema);
