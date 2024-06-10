const express = require('express');
const User = require('../models/user');
const authenticateUser = require('../middleware/authenticateUser');
const router = express.Router();

// Get all users with their levels
router.get('/users', authenticateUser, async (req, res) => {
    try {
        const users = await User.find({}, 'username taldaLevel SJLevel sozdlyLevel maqalLevel tyndaLevel');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
