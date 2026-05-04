// This is the GAME SEARCH MODAL - pops up when the user clicks "Add Game"
// Like a search screen where you look up games from the RAWG database

import { useState } from 'react';
import axios from 'axios';

function GameSearchModal({ onClose, onAddGame }) {
  const [query, setQuery] = useState(''); // What the user types in the search box
  const [results, setResults] = useState([]); // Game returned from RAWG
  const [loading, setLoading] = useState(false); // Track if we're searching
  const [error, setError] = useState(''); // Store any error messages

  // This runs when the user types in the search box
  const handleSearch = async (e) {
    const value = e.target.value;
    setQuery(value);

    // Don't search if the query is too short
    if (value.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Search RAWG API for games matching the query
      const res = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key: import.meta.env.VITE_RAWG_API_KEY, // Our RAWG API key
          search: value, // What to search for
          page_size: 6, // Only return 6 results
        },
      });
      setResults(res.data.results); // Save the results
    } catch (err) {
      setError('Failed to search games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // This runs when the user clicks "Add" on a game
  const handleAdd = (game) => {
    // Pull out the info we need from the RAWG result
    const gameData = {
      rawId: game.id,
      title: game.name,
      coverImage: game.background_image || '',
      platform: game.platform
        ? game.platforms.map((p) => p.platform.name).join(', ')
        : '',
      genre: game.genres
        ? game.genres.map((g) => g.name).join(', ')
        : '',
      releaseYear: game.released
        ? game.released.split('-')[0]
        : '',
    };

    onAddGame(gameData); // Send the game data up to the Library page
    onClose();           // Close the modal
  };

  
}