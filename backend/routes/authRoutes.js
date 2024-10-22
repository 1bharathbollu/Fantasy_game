const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Import the User model correctly (capital "U")
const User = mongoose.model('User');

// POST register user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Failed to register user', error });
    }
});

// POST login user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isValid = await user.comparePassword(req.body.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to login user', error });
    }
});

module.exports = router;
