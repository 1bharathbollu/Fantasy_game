const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Import models
require('./models/player');
require('./models/Team');
require('./models/user');

const teamRoutes = require('./routes/teamRoutes');
const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');

const app = express();

// Middleware
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS for all requests

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fantasy_game', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack

    // Provide different error messages based on the environment
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({ message: 'Something went wrong!', error: err.message });
    } else {
        res.status(500).send('Something went wrong!'); // Generic error message for production
    }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Confirmation message
});