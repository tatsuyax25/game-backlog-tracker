// This is the LIBRARY PAGE - where users see all their saved games
// Like the game collection screen where you can see all your games

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GameSearchModal from "../components/GameSearchModal"; // Our search modal
import EditGameModal from '../components/EditGameModal'; // Our edit modal

function Library() {
  const [games, setGames] = useState([]); // Store the list of games
  const [loading, setLoading] = useState(true); // Track if we're loading
  const [error, setError] = useState(""); // Store any error messages
  const [showModal, setShowModal] = useState(false); // Track if the modal is open
  const [filter, setFilter] = useState("All"); // Track which status filter is active
  const [sort, setSort] = useState('newest'); // Track which sort option is active
  const [selectedGame, setSelectedGame] = useState(null); // Track which game is selected for editing
  const navigate = useNavigate();

  // Get the JWT token from localStorage (our ticket)
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // This runs when the page first loads
  useEffect(() => {
    // If there's no token, send them to the login page
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch all games from the backend
    const fetchGames = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/library`, {
          headers: { Authorization: `Bearer ${token}` }, // Send our ticket
        });
        setGames(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your library");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token, navigate]);

  // This runs when the user adds a game from the search modal
  const handleAddGame = async (gameData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/library`,
        gameData,
        { headers: { Authorization: `Bearer ${token}` } }, // Send our ticket
      );
      // Add the new game to the top of the list without refreshing
      setGames([res.data, ...games]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add game");
    }
  };

  // This runs when the user saves changes in the Edit modal
  const handleUpdateGame = (updatedGame) => {
    // Replace the old game with the updated one in the list
    setGames(games.map((g) => (g._id === updatedGame._id ? updatedGame : g)));
  };

  // This runs when the user deletes a game in the Edit modal
  const handleDeleteGame = (gameId) => {
    // Remove the deleted game from the list
    setGames(games.filter((g) => g._id !== gameId));
  }

  // Status badge colors
  const statusColors = {
    Playing: "bg-green-500 bg-opacity-20 text-green-400",
    Completed: "bg-purple-500 bg-opacity-20 text-purple-400",
    Backlog: "bg-gray-500 bg-opacity-20 text-gray-400",
    Dropped: "bg-red-500 bg-opacity-20 text-red-400",
    Wishlist: "bg-yellow-500 bg-opacity-20 text-yellow-400",
  };

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-xl">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      {/* Game Search Modal - only shows when showModal is true */}
      {showModal && (
        <GameSearchModal
          onClose={() => setShowModal(false)} // Close the modal
          onAddGame={handleAddGame} // Add a game to the library
        />
      )}

      {/* Edit Game Modal - only shows when a game is selected */}
      {selectedGame && (
        <EditGameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)} // Close the modal
          onUpdate={handleUpdateGame}
          onDelete={handleDeleteGame}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-400">My Library</h1>
          <p className="text-gray-400 mt-1">Welcome back, {name}!</p>
        </div>
        <button
          onClick={() => setShowModal(true)} // Open the modal when clicked
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition"
        >
          + Add Game
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Playing", "Completed", "Backlog", "Dropped", "Wishlist"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === status
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {status}
            </button>
          ),
        )}
      </div>

      {/* Sort dropdown */}
      <div className="flex justify-end mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-gray-400 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
        >
          <option value="newest">Sort: Newest first</option>
          <option value="oldest">Sort: Oldest first</option>
          <option value="title">Sort: Title (A-Z)</option>
          <option value="rating">Sort: Rating (high to low)</option>
        </select>
      </div>

      {/* Empty state - no games yet */}
      {games.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎮</p>
          <p className="text-xl text-gray-400">Your library is empty!</p>
          <p className="text-gray-500 mt-2">Click "Add Game" to get started.</p>
        </div>
      ) : (
        // Game card grid
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            ...(filter === "All"
              ? games
              : games.filter((g) => g.status === filter)),
          ]
            .sort((a, b) => {
              if (sort === "newest")
                return new Date(b.createdAt) - new Date(a.createdAt);
              if (sort === "oldest")
                return new Date(a.createdAt) - new Date(b.createdAt);
              if (sort === "title") return a.title.localeCompare(b.title);
              if (sort === "rating") return b.rating - a.rating;
              return 0;
            })
            .map((game) => (
              <div
                key={game._id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedGame(game)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedGame(game)}
                className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition cursor-pointer"
              >
                {/* Game cover image */}
                {game.coverImage ? (
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-800 flex items-center justify-center">
                    <span className="text-4xl">🎮</span>
                  </div>
                )}

                {/* Game info */}
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{game.title}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${statusColors[game.status]}`}
                  >
                    {game.status}
                  </span>

                  {/* Star rating */}
                  {game.rating > 0 && (
                    <div className="mt-2 text-yellow-400 text-xs">
                      {"★".repeat(game.rating)}
                      {"☆".repeat(5 - game.rating)}
                    </div>
                  )}

                  {/* Notes preview */}
                  {game.notes && (
                    <p className="mt-2 text-xs text-gray-400 truncate">
                      📝 {game.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Library;