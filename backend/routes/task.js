const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const authenticateToken = require("./auth");

router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, des } = req.body; // Using 'des' instead of 'desc'
        const { id } = req.headers; // Ensure the correct user ID is being sent

        if (!title || !des || !id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create and save task
        const newTask = new Task({ title, des : des });
        const saveTask = await newTask.save();
        const taskId = saveTask._id;

        // Update user with new task ID
        await User.findByIdAndUpdate(id, { $push: { tasks: taskId } });

        res.status(200).json({ message: "Task registered successfully" });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get("/get-all-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch user and populate tasks
        const userData = await User.findById(id).populate({path :"tasks", options : { sort : {createdAt : -1}} ,});

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ data: userData });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;

        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (!userId) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const {title , des} = req.body;
        await Task.findByIdAndUpdate(id, {title : title , des : des});
        
        res.status(200).json({ message: "Task updated successfully" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
      
        await Task.findByIdAndUpdate(id, {important : !ImpTask});
        
        res.status(200).json({ message: "Task updated successfully" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const CompleteTask = TaskData.complete;
        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }
      
        await Task.findByIdAndUpdate(id, {complete : !CompleteTask});
        
        res.status(200).json({ message: "Task updated successfully" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch user and populate tasks
        const ImpData = await User.findById(id).populate({path :"tasks",match : {important : true}, options : { sort : {createdAt : -1}} ,});

       const ImpTasks = ImpData.tasks;

        res.status(200).json({ data:  ImpTasks  });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch user and populate tasks
        const Data = await User.findById(id).populate({path :"tasks",match : {complete : true}, options : { sort : {createdAt : -1}} ,});

       const CompleteTasks = Data.tasks;

        res.status(200).json({ data:  CompleteTasks  });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch user and populate tasks
        const Data = await User.findById(id).populate({path :"tasks",match : {complete : false}, options : { sort : {createdAt : -1}} ,});

       const IncompleteTasks = Data.tasks;

        res.status(200).json({ data:  IncompleteTasks  });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


module.exports = router;
