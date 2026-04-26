// This is the BLUEPRINT for a Game in someone's library
// Like a trading card that holds all the info about one game

const mongoose = require('mongoose'); // Mongoose helps us talk to the database

const gameEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // WHO own this game card
    rawId: { type: Number, required: true }, // The game's ID from the RAWG website
    title: { type: String, required: true }, // Game name (e.g. "Elden Ring")
    coverImage: { type: String, default: '' }, // Picture of the game cover
    platform: { type: String, default: '' }, // Where you play it (PS5, PC, etc.)
    genres: { type: String, default: '' }, // What kind of game (RPG, Action, etc.)
    releaseYear: { type: String, default: '' }, // When it came out
    status: {
      type: String,
      // Only these exact words are allowed as a status
      enum: ['Playing', 'Completed', 'Backlog', 'Dropped', 'Wishlist'],
      default: 'Backlog', // If you don't pick one, it starts as Backlog
    },
    rating: { type: Number, min: 0, max: 5, default: 0 }, // Your star rating (0 to 5 stars)
    notes: { type: String, default: '' }, // Your personal notes about the game
  },
  { timestamps: true } // Saves when the entry was created and last updated
);

module.exports = mongoose.model('GameEntry', gameEntrySchema); // This creates a "GameEntry" model we can use to create and manage game entries in the database