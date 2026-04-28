// These are the DOORS for auth requests
// Each door leads to a different action in authController

const express = require('express');
const router = express.Router(); // Router is like a mini app just for these routes
const { register, login } = require('../controllers/authController'); // Bring in our auth actions

// POST /api/auth/register -> create a brand new account
router.post('/register', register);

// POST /api/auth/login -> log into an existing account
router.post('/login', login);

module.exports = router; // Export the router so our main app can use it