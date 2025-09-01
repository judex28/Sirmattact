const Task = require('../models/task');

// Create Task
exports.create = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json({
      message: 'Task created successfully',
      data: savedTask,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error creating task',
      error: err.message,
    });
  }
};

// Get All Tasks (with optional filters)
exports.findAll = async (req, res) => {
  try {
    const { keyword, status } = req.query;
    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching tasks',
      error: err.message,
    });
  }
};

// Get Task by ID
exports.findOne = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching task',
      error: err.message,
    });
  }
};

// Update Task
exports.update = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated doc
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating task',
      error: err.message,
    });
  }
};

// Delete Task
exports.delete = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error deleting task',
      error: err.message,
    });
  }
};
