const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: String,
    team: String,
    points: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', playerSchema);