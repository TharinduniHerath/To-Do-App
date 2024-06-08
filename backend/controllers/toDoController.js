const asyncHandler = require("express-async-handler");
const ToDo = require("../models/toDoModel");

const getTasks = asyncHandler(async (req, res) => {
  const { sortBy, filterBy, filterValue } = req.query;
  let query = ToDo.find();

  if (filterBy && filterValue) {
    query = query.where(filterBy).equals(filterValue);
  }

  if (sortBy) {
    query = query.sort(sortBy);
  }

  const tasks = await query;
  res.status(200).json({ tasks });
});

const createTask = asyncHandler(async (req, res) => {
  const { text, dueDate, priority } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const task = await ToDo.create({ text, dueDate, priority });
  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await ToDo.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found!");
  }
  const updatedTask = await ToDo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await ToDo.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found!");
  }
  await task.deleteOne();
  res.status(200).json({ message: "Task deleted" });
});

const taskCompleted = asyncHandler(async (req, res) => {
  const task = await ToDo.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found!");
  }
  task.completed = true;
  await task.save();
  res.status(200).json(task);
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  taskCompleted,
};
