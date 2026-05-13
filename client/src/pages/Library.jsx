// This is the LIBRARY PAGE - where users see all their saved games
// Like the game collection screen where you can see all your games

import { useEffect, useRef, useState } from "react";
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
  const [sortOpen, setSortOpen] = useState(false); // Track whether the sort menu is open
  const [selectedGame, setSelectedGame] = useState(null); // Track which game is selected for editing
  const sortMenuRef = useRef(null);
  const navigate = useNavigate();

  // Get the JWT token from localStorage (our ticket)
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const sortOptions = [
    { value: "newest", label: "Sort: Newest first" },
    { value: "oldest", label: "Sort: Oldest first" },
    { value: "title", label: "Sort: Title (A-Z)" },
    { value: "rating", label: "Sort: Rating (high to low)" },
  ];

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ||
    sortOptions[0].label;

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

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target)
      ) {
        setSortOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

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
    <div className="min-h-screen bg-gray-950 px-4 py-6 text-white sm:px-6 sm:py-8">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-400">My Library</h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome back, {name}!</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition self-start sm:self-auto"
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
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Playing", "Completed", "Backlog", "Dropped", "Wishlist"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${
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
      <div className="mb-6 flex justify-stretch sm:justify-end">
        <div ref={sortMenuRef} className="relative w-full sm:w-64">
          <button
            type="button"
            onClick={() => setSortOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-700 focus:border-purple-500 focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <span className="truncate">{selectedSortLabel}</span>
            <span className="ml-3 text-gray-500">⌄</span>
          </button>

          {sortOpen && (
            <div
              role="listbox"
              aria-label="Sort games"
              className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={sort === option.value}
                  onClick={() => {
                    setSort(option.value);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm transition ${
                    sort === option.value
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
              <button
                key={game._id}
                type="button"
                onClick={() => setSelectedGame(game)}
                className="overflow-hidden rounded-xl bg-gray-900 text-left transition hover:ring-2 hover:ring-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {/* Game cover image */}
                {game.coverImage ? (
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-800">
                    <span className="text-4xl">🎮</span>
                  </div>
                )}

                {/* Game info */}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{game.title}</p>
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
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default Library;
