// This is the LIBRARY PAGE - where users see all their saved games
// Like the game collection screen where you can see all your games

import { useEffect, useState } from "react"; // useEffect runs code when the page loads
import { useNavigate } from "react-router-dom"; // useNavigate lets us redirect
import axios from "axios"; // Axios sends requests to our backend

function Library() {
  const [games, setGames] = useState([]); // Store the list of games
  const [loading, setLoading] = useState(true); // Track if we're loading
  const [error, setError] = useState(""); // Store any error messages
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
          headers: { Authorization: `Bearer ${token}` }, // Send our ticket with the request
        });
        setGames(res.data); // Save the games to state
      } catch (err) {
        console.error(err);
        setError("Failed to load your library");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-400">My Library</h1>
          <p className="text-gray-400 mt-1">Welcome back, {name}!</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition">
          + Add Game
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

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
          {games.map((game) => (
            <div
              key={game._id}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;