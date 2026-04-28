// These are the DOORS for library requests
// The bouncer (protect) checks your ticket before letting you through any of them

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware'); // The bouncer!
const { getLibrary, addGame, updateGame, deleteGame } = require('../controllers/libraryController'); // Bring in our library actions

// GET /api/library -> show all my games (must be logged in)
router.get('/', protect, getLibrary);

// POST /api/library -> add a new game (must be logged in)
router.post('/', protect, addGame);

// PUT /api/library/:id -> update a game by its ID (must be logged in)
router.put('/:id', protect, updateGame);

// DELETE /api/library/:id -> remove a game by its ID (must be logged in)
router.delete('/:id', protect, deleteGame);

module.exports = router; // Export the router so our main app can use it