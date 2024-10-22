const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Player = mongoose.model('Player');

// GET all players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find().exec();
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch players', error: error.message });
    }
});

// GET a specific player by ID
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).exec();
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch player', error: error.message });
    }
});

// POST create a new player
router.post('/', async (req, res) => {
    try {
        const { name, team, points } = req.body;
        const player = new Player({ name, team, points });
        await player.save();
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create player', error: error.message });
    }
});

// PUT update a player
router.put('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update player', error: error.message });
    }
});

// DELETE a player
router.delete('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndRemove(req.params.id).exec();
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete player', error: error.message });
    }
});

module.exports = router;