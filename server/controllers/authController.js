// This handles SIGNING UP and LOGGING IN
// Like the front dest at a hotel - checking you in or out

const bcrypt = require('bcryptjs'); // bcrypt scrambles passwords so nobody can read them
const jwt = require('jsonwebtoken'); // JWT creates a special "ticket" after you log in
const User = require('../models/User'); // Our User blueprint

// Helper function: creates a special ticket (token) for the user
// The ticket expires in 7 days - like a week-long theme park pass
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// REGISTER - creating a brand new account
exports.register = async (req, res) => {
  const { name, email, password } = req.body; // Grab what the user typed in
  try {
    // Check if someone already has this email - no duplicate allowed!
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // Scramble the password so it's safe to store (like a secret code)
    const hashed = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const user = await User.create({ name, email, password: hashed });

    // Send back a ticket so they're automatically logged in
    res.status(201).json({ token: generateToken(user._id), name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

