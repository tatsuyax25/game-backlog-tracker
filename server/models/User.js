// This is the BLUEPRINT for a User
// Like a form you fill out when signing up for a new game account

const mongoose = require('mongoose'); // Mongoose helps us talk to the database

// Here we describe what a User looks like
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // The user's name (required!)
    email: { type: String, required: true, unique: true, lowercase: true }, // Email (must be unique - no duplicates!)
    password: { type: String, required: true }, // Password (we'll scramble this so nobody can read it)
  },
  { timestamps: true } // Automatically saves when the account was created and last updated
);

// Package up the blueprint and share it with the rest of the app
module.exports = mongoose.model('User', userSchema); // This creates a "User" model we can use to create and manage users in the database