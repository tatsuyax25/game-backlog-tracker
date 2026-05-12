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
  const handleSearch = async (e) => {
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
    } catch {
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

  return (
    // Dark overlay behind the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-70 px-4 py-6">
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-gray-900 p-4 sm:p-6">

        {/* Modal header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-400">Add a Game</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 transition hover:text-white"
            aria-label="Close add game modal"
          >
            ×
          </button>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search for a game..."
          className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          autoFocus
        />

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* Loading state */}
        {loading && (
          <p className="text-gray-400 text-center py-4">Searching...</p>
        )}

        {/* Search results */}
        <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
          {results.map((game) => (
            <div
              key={game.id}
              className="flex items-center gap-3 rounded-lg bg-gray-800 p-3"
            >
              {/* Game cover thumbnail */}
              {game.background_image ? (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-700">
                  <span>🎮</span>
                </div>
              )}

              {/* Game info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{game.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {game.genres?.map((g) => g.name).join(', ')}
                </p>
              </div>

              {/* Add button */}
              <button
                onClick={() => handleAdd(game)}
                className="flex-shrink-0 rounded-lg bg-purple-600 px-3 py-1 text-sm font-semibold transition hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!loading && query.length >= 3 && results.length === 0 && (
          <p className="text-gray-400 text-center py-4">No games found. Try a different search!</p>
        )}
      </div>
    </div>
  );
}

export default GameSearchModal;
