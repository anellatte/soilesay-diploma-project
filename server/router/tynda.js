const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tynda = require('../models/Tynda'); // Adjust the path as necessary
const authenticateUser = require("../middleware/authenticateUser");
const { checkAdmin } = require("../middleware/checkAdmin");
// Configure Multer for audio uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/audio/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
            cb(null, true);
        } else {
            cb(new Error('Only MP3 files are allowed!'), false);
        }
    }
});

// Get all levels (Admin)
router.get('/all', authenticateUser, checkAdmin, async (req, res) => {
    try {
        const levels = await Tynda.find().sort({ createdAt: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels" });
    }
});

// Create a new level (Admin)
router.post('/', authenticateUser, checkAdmin, upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No audio file uploaded or invalid file type." });
    }
    const { word } = req.body;
    const audioPath = req.file.path;
    try {
        const newLevel = new Tynda({ word, audioPath });
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

// Update a level (Admin)
router.put('/:id', authenticateUser, checkAdmin, upload.single('audio'), async (req, res) => {
    try {
        const level = await Tynda.findById(req.params.id);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        level.word = req.body.word || level.word;
        if (req.file) {
            level.audioPath = req.file.path;
        }
        await level.save();
        res.json(level);
    } catch (error) {
        res.status(400).json({ message: "Error updating level", error: error.message });
    }
});

// Delete a level (Admin)
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
