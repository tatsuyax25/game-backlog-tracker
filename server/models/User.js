// This is the BLUEPRINT for a User
// Like a form you fill out when signing up for a new game account

const mongoose = require('mongoose'); // Mongoose helps us talk to the database

// Here we describe what a User looks like
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: '', maxlength: 300 },
  },
  { timestamps: true } // Automatically saves when the account was created and last updated
);

// Package up the blueprint and share it with the rest of the app
module.exports = mongoose.model('User', userSchema); // This creates a "User" model we can use to create and manage users in the database