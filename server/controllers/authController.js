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

// GET PROFILE - fetch current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE PROFILE - change name, bio, email, or password
exports.updateProfile = async (req, res) => {
  const { name, bio, email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Changing email or password requires current password verification
    if (email || newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required' });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && existing._id.toString() !== user._id.toString())
        return res.status(400).json({ message: 'Email already in use' });
      user.email = email.toLowerCase();
    }
    if (newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({ message: 'Profile updated', name: user.name, email: user.email, bio: user.bio });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// LOGIN - coming back to an existing account
exports.login = async (req, res) => {
  const { email, password } = req.body; // Grab what the user typed in
  try {
    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' }); // No account found!

    // Compare the typed password with the scrambled one in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' }); // Wrong password!

    // Password matches! Send back their ticket
    res.json({ token: generateToken(user._id), name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};