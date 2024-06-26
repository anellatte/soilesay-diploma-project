const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const { checkAdmin } = require("../middleware/checkAdmin");
const Puzzle = require("../models/puzzle");

// Get levels for the current user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const user = req.user;  // Assume user is attached to req in authenticateUser middleware
        const levels = await Puzzle.find({ level: { $lte: user.puzzleLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels" });
    }
});

// Create a new level (admin)
router.post("/", authenticateUser, checkAdmin, async (req, res) => {
    const { wordPairs } = req.body;
    try {
        // Find the highest existing level
        const highestLevel = await Puzzle.findOne().sort({ level: -1 });
        const nextLevel = highestLevel ? highestLevel.level + 1 : 1;

        const newLevel = new Puzzle({ wordPairs, level: nextLevel });

        const savedLevel = await newLevel.save();
        res.status(201).json(savedLevel);
    } catch (error) {
        res.status(400).json({ message: "Error creating level" });
    }
});

// Get all levels (admin)
router.get("/all", authenticateUser, checkAdmin, async (req, res) => {
    try {
        const levels = await Puzzle.find().sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels" });
    }
});

// Update a level (admin)
router.put("/:id", authenticateUser, checkAdmin, async (req, res) => {
    const { id } = req.params;
    const { wordPairs } = req.body;

    try {
        const existingLevel = await Puzzle.findById(id);
        if (!existingLevel) {
            return res.status(404).json({ message: "Level not found" });
        }

        existingLevel.wordPairs = wordPairs;

        const updatedLevel = await existingLevel.save();
        res.json(updatedLevel);
    } catch (error) {
        res.status(400).json({ message: "Error updating level" });
    }
});

// Delete a level (admin)
router.delete("/:id", authenticateUser, checkAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLevel = await Puzzle.findByIdAndDelete(id);
        if (!deletedLevel) {
            return res.status(404).json({ message: "Level not found" });
        }

        // Re-sequence the levels
        const remainingLevels = await Puzzle.find().sort({ level: 1 });
        for (let i = 0; i < remainingLevels.length; i++) {
            remainingLevels[i].level = i + 1;
            await remainingLevels[i].save();
        }

        res.json({ message: "Level deleted and levels re-sequenced successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting level" });
    }
});

// Get a specific level (admin)
router.get("/:id", authenticateUser, checkAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const level = await Puzzle.findById(id);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.json(level);
    } catch (error) {
        res.status(500).json({ message: "Error fetching level" });
    }
});

// Get completed levels for the current user
router.get("/completed", authenticateUser, async (req, res) => {
    try {
        const user = req.user;  // Assume user is attached to req in authenticateUser middleware
        const levels = await Puzzle.find({ level: { $lt: user.puzzleLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching completed levels" });
    }
});

module.exports = router;
