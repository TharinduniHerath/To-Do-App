const express = require("express");
const router = express.Router();
const toDoController = require("../controllers/toDoController");


router.get("/tasks", toDoController.getTasks);
router.post("/tasks", toDoController.createTask);
router.put("/tasks/:id", toDoController.updateTask);
router.delete("/tasks/:id", toDoController.deleteTask);
router.patch("/tasks/:id", toDoController.taskCompleted);



module.exports = router;
