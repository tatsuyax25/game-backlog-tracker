// This handles everything to do with the user's GAME LIBRARY
// Like a librarian who can show, and, update, or remove your books

const GameEntry = require('../models/GameEntry'); // Our GameEntry blueprint

// GET - show me all my games
exports.getLibrary = async (req, res) => {
  try {
    // Find all games that belong to THIS user, newest first
    const games = await GameEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(games); // Send the list back
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST - add a new game to my library
exports.addGame = async (req, res) => {
  const { rawId, title, coverImage, platform, genre, releaseYear, status, rating, notes } = req.body; // Grab what the user typed in
  try {
    // Make sure this game isn't already in their library (no duplicates allowed!)
    const existing = await GameEntry.findOne({ userId: req.user.id, rawId });
    if (existing) return res.status(400).json({ message: 'Game already in library' });

    // Save the new game entry to the database
    const game = await GameEntry.create({
      userId: req.user.id,
      rawId, title, coverImage, platform, genre, releaseYear, status, rating, notes,
    });
    res.status(201).json(game); // Send the saved game back
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};