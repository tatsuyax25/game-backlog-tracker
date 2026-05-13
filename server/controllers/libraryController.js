// This handles everything to do with the user's GAME LIBRARY
// Like a librarian who can show, and, update, or remove your books

const GameEntry = require('../models/GameEntry'); // Our GameEntry blueprint

// GET - show me all my games
exports.getLibrary = async (req, res) => {
  try {
    // Find all games that belong to THIS user, newest first
    const games = await GameEntry.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(games); // Send the list back
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST - add a new game to my library
exports.addGame = async (req, res) => {
  const {
    rawId,
    title,
    coverImage,
    platform,
    genre,
    releaseYear,
    status,
    rating,
    notes,
  } = req.body; // Grab what the user typed in
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

// PUT - update an existing game (change status, rating, notes)
exports.updateGame = async (req, res) => {
  try {
    // Find the game by its ID AND make sure it belongs to this user
    const game = await GameEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Find it
      req.body, // Update it with new data
      { returnDocument: 'after' } // Return the updated version
    );
    if (!game) return res.status(404).json({ message: 'Game not found' }); // No game found or doesn't belong to user
    res.json(game); // Send the updated game back
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE - remove a game from my library
exports.deleteGame = async (req, res) => {
  try {
    // Find the game and delete it - but only if it belongs to this user
    const game = await GameEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game removed from library' }); // Confirm it's gone
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}