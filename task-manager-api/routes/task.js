const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskscontroller");

// Create Task
router.post("/", taskController.create);

// Get All Tasks
router.get("/", taskController.findAll);

// Get Task by ID
router.get("/:id", taskController.findOne);

// Update Task
router.put("/:id", taskController.update);

// Delete Task
router.delete("/:id", taskController.delete);

module.exports = router;
