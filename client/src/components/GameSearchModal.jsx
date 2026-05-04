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

    
  }
}