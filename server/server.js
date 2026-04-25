// This is the MAIN file that starts everything up
// Think of it like turing on a video game console

const express = require('express'); // Express is like the game engine - it runs our app
const mongoose = require('mongoose'); // Mongoose talks to our database (where we save stuff)
const cors = require('cors'); // CORS lets our React app talk to this server
require('dotenv').config(); // This reads our secret settings from the .env file

// Bring in our route files (like different sections of a menu)
const authRoutes = require('./routes/authRoutes'); // Handles login/signup
const libraryRoutes = require('./routes/libraryRoutes'); // Handles game library stuff

const app = express(); // Create our app - like plugging in the console

app.use(cors()); // Allow the React app to talk to us
app.use(express.json()); // Allow the app to read JSON data (like reading a letter)

// Tell the app which routes handle which URLs
app.use('/api/auth', authRoutes); // Login/register stuff goes here
app.use('/api/library', libraryRoutes); // Game library stuff goes here

// A simple test route - like a "hello world" sign at the door
app.get('/', (req, res) => res.send('Game Backlog API running'));

// Connect to MongoDB (Our database) then start listening for requests
mongoose
  .connect(process.env.MONGO_URI) // Use the secret database address from .env
  .then(() => {
    console.log('MongoDB connected'); // Yay! Database is connected!
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`) // App is awake and listening!
    );
  })
  .catch((err) => console.error(err)); // Uh oh, something went wrong