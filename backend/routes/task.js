const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const authenticateToken = require("../routes/auth");

// Create Task
router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, des } = req.body;
        const { id } = req.headers;

        if (!title || !des || !id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTask = new Task({ title, des });
        const savedTask = await newTask.save();
        await User.findByIdAndUpdate(id, { $push: { tasks: savedTask._id } });

        res.status(200).json({ message: "Task created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get All Tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: user.tasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
});

// Delete Task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.headers.id;

        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });

        await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
});

// Update Task Title/Description
router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const { title, des } = req.body;
        await Task.findByIdAndUpdate(req.params.id, { title, des });
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// Toggle Important
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.important = !task.important;
        await task.save();
        res.status(200).json({ message: "Important status toggled" });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// Toggle Complete
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.complete = !task.complete;
        await task.save();
        res.status(200).json({ message: "Complete status toggled" });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// Filter: Important
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).populate({
            path: "tasks",
            match: { important: true },
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: user.tasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching important tasks", error: error.message });
    }
});

// Filter: Completed
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).populate({
            path: "tasks",
            match: { complete: true },
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: user.tasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching complete tasks", error: error.message });
    }
});

// Filter: Incomplete
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).populate({
            path: "tasks",
            match: { complete: false },
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: user.tasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching incomplete tasks", error: error.message });
    }
});
router.get('/get-user', authenticateToken, async (req, res) => {
  const { id } = req.headers;
  const user = await User.findById(id).select('username email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

module.exports = router;
