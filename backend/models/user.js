const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving the user
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password during login
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

// Correctly export the User model
module.exports = mongoose.model('User', userSchema); // Capital "U"