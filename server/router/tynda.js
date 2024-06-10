const express = require('express');
const multer = require('multer');
const Tynda = require('../models/Tynda');
const authenticateUser = require("../middleware/authenticateUser");
const { checkAdmin } = require("../middleware/checkAdmin");

const router = express.Router();

// Configure Multer for audio uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/audio/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Ensure unique filenames
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
            cb(null, true);
        } else {
            cb(new Error('Only MP3 files are allowed!'), false);
        }
    }
});

// Get all levels
router.get('/', async (req, res) => {
    try {
        const levels = await Tynda.find().sort({ level: 1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels" });
    }
});

// Create a new level
router.post('/', authenticateUser, checkAdmin, upload.single('audio'), async (req, res) => {
    const { word, level } = req.body;
    const audioPath = req.file?.path;
    try {
        const newLevel = new Tynda({ word, audioPath, level });
        await newLevel.save();
        res.status(201).json(newLevel);
    } catch (error) {
        res.status(400).json({ message: "Error creating level", error: error.message });
    }
});

// Get a specific level
router.get('/:id', async (req, res) => {
    try {
        const level = await Tynda.findById(req.params.id);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.json(level);
    } catch (error) {
        res.status(500).json({ message: "Error fetching level" });
    }
});

// Update a level
router.put('/:id', authenticateUser, checkAdmin, upload.single('audio'), async (req, res) => {
    try {
        const level = await Tynda.findById(req.params.id);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        level.word = req.body.word || level.word;
        level.level = req.body.level || level.level;
        if (req.file) {
            level.audioPath = req.file.path;
        }
        await level.save();
        res.json(level);
    } catch (error) {
        res.status(400).json({ message: "Error updating level", error: error.message });
    }
});

// Delete a level
router.delete('/:id', authenticateUser, checkAdmin, async (req, res) => {
    try {
        const level = await Tynda.findByIdAndDelete(req.params.id);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.json({ message: "Level deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting level", error: error.message });
    }
});

module.exports = router;
