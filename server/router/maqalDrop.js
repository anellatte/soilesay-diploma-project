const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { checkAdmin } = require('../middleware/checkAdmin');
const MaqalDrop = require('../models/MaqalDrop');

// Get all levels (admin)
router.get('/all', authenticateUser, checkAdmin, async (req, res) => {
    try {
        const levels = await MaqalDrop.find().sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching levels' });
    }
});

// Create a new level (admin)
router.post('/', authenticateUser, checkAdmin, async (req, res) => {
    const { sentence } = req.body;
    try {
        // Find the highest existing level
        const highestLevel = await MaqalDrop.findOne().sort({ level: -1 });
        const nextLevel = highestLevel ? highestLevel.level + 1 : 1;

        const newLevel = new MaqalDrop({ sentence, level: nextLevel });

        const savedLevel = await newLevel.save();
        res.status(201).json(savedLevel);
    } catch (error) {
        res.status(400).json({ message: 'Error creating level' });
    }
});

// Get a specific level (admin)
router.get('/:id', authenticateUser, checkAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const level = await MaqalDrop.findById(id);
        if (!level) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.json(level);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching level' });
    }
});

// Update a level (admin)
router.put('/:id', authenticateUser, checkAdmin, async (req, res) => {
    const { id } = req.params;
    const { sentence, level } = req.body;

    try {
        const updatedLevel = await MaqalDrop.findByIdAndUpdate(id, { sentence, level }, { new: true });
        if (!updatedLevel) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.json(updatedLevel);
    } catch (error) {
        res.status(400).json({ message: 'Error updating level' });
    }
});

// Delete a level (admin)
router.delete('/:id', authenticateUser, checkAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLevel = await MaqalDrop.findByIdAndDelete(id);
        if (!deletedLevel) {
            return res.status(404).json({ message: 'Level not found' });
        }

        // Re-sequence the levels
        const remainingLevels = await MaqalDrop.find().sort({ level: 1 });
        for (let i = 0; i < remainingLevels.length; i++) {
            remainingLevels[i].level = i + 1;
            await remainingLevels[i].save();
        }

        res.json({ message: 'Level deleted and levels re-sequenced successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting level' });
    }
});

module.exports = router;
