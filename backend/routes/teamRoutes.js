const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Team = mongoose.model('Team');
const Player = mongoose.model('Player');

// GET all players
router.get('/players', async (req, res) => {
    try {
        const players = await Player.find().exec();
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch players' });
    }
});

// POST create a new team
router.post('/', async (req, res) => {
    try {
        const { name, players } = req.body;
        if (players.length > 11) {
            return res.status(400).json({ message: 'Maximum 11 players allowed' });
        }
        const team = new Team({ name, players });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create team', error: error.message });
    }
});


// GET specific team by ID
router.get('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('players').exec();
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch team' });
    }
});

// PUT update team points
router.put('/teams/:id/update-points', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('players').exec();
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        team.totalPoints = team.players.reduce((total, player) => total + player.points, 0);
        await team.save();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update team points' });
    }
});

// PUT update team
router.put('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update team' });
    }
});

// DELETE team
router.delete('/teams/:id', async (req, res) => {
    try {
        await Team.findByIdAndRemove(req.params.id).exec();
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete team' });
    }
});

module.exports = router;