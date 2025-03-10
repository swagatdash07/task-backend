const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a Task
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = new Task({ userId: req.user.userId, title, description });
        await task.save();
        res.status(201).json({ status: 1, message: "Task created successfully", data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Tasks for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json({ status: 1, message: "Fetch all task list", data: tasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a Specific Task
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.userId) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ status: 1, message: "fetch task by Id", data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a Task
router.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.userId) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        await task.save();

        res.json({ status: 1, message: "Task update successfully", data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a Task
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.userId) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ status: 1, message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
