// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { checkAdmin } = require('../middleware/checkAdmin');
const Event = require('../models/Event');
const User = require('../models/User');

// User creates an event
router.post('/create', authenticateUser, async (req, res) => {
    const { title, description, date, place } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            place,
            createdBy: req.user._id,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admin approves an event
router.put('/approve/:id', authenticateUser, checkAdmin, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.isApproved = true;
        await event.save();

        const user = await User.findById(event.createdBy);
        user.notifications.push({ message: 'Your event has been approved' });
        await user.save();

        res.status(200).json({ message: 'Event approved', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admin deletes an event
router.delete('/delete/:id', authenticateUser, checkAdmin, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const user = await User.findById(event.createdBy);
        user.notifications.push({ message: 'Your event has been disapproved and deleted' });
        await user.save();

        res.status(200).json({ message: 'Event disapproved and deleted', event });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all approved events (accessible to everyone)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ isApproved: true }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get all events for admin (accessible only to admin)
router.get('/all', authenticateUser, checkAdmin, async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get notifications for the user
router.get('/notifications', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const unreadNotifications = user.notifications.filter(notification => !notification.isRead);
        res.json(unreadNotifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Mark a notification as read
router.put('/notifications/:id', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const notification = user.notifications.id(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.isRead = true;
        await user.save();
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});

module.exports = router;
