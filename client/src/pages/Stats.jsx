// This is the STATS PAGE - shows fun statistics about your game library
// Like the stats screen in a video game that shows your playtime and achievements

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Colors for each status
const STATUS_COLORS = {
  Playing: "bg-green-500",
  Completed: "bg-purple-500",
  Backlog: "bg-gray-500",
  Dropped: "bg-red-500",
  Wishlist: "bg-yellow-500",
};

const STATUS_TEXT_COLORS = {
  Playing: "text-green-400",
  Completed: "text-purple-400",
  Backlog: "text-gray-400",
  Dropped: "text-red-400",
  Wishlist: "text-yellow-400",
};

function Stats() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGames = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/library`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(res.data);
      } catch (err) {
        console.log(err);
        console.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-xl">Loading stats...</p>
      </div>
    );
  }

  // Calculate stats
  const totalGames = games.length;
  const completed = games.filter((g) => g.status === "Completed").length;
  const ratedGames = games.filter((g) => g.rating > 0);
  const avgRating =
    ratedGames.length > 0
      ? (
          ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length
        ).toFixed(1)
      : "N/A";

  // Status breakdown
  const statusData = ["Playing", "Completed", "Backlog", "Dropped", "Wishlist"]
    .map((status) => ({
      name: status,
      value: games.filter((g) => g.status === status).length,
    }))
    .filter((item) => item.value > 0);

  // Genre breakdown
  const genreCounts = {};
  games.forEach((game) => {
    if (game.genre) {
      game.genre.split(",").forEach((g) => {
        const genre = g.trim();
        if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  const genreData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const maxGenreCount = genreData.length > 0 ? genreData[0].value : 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6 sm:px-6 sm:py-8">
      {/* Page header */}
      <h1 className="mb-6 text-2xl font-bold text-purple-400 sm:mb-8 sm:text-3xl">
        My Stats
      </h1>

      {totalGames === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-xl text-gray-400">No stats yet!</p>
          <p className="text-gray-500 mt-2">
            Add some games to your library first.
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-xl bg-gray-900 p-4 text-center sm:p-5">
              <p className="text-gray-400 text-sm mb-1">Total games</p>
              <p className="text-3xl font-bold text-white sm:text-4xl">
                {totalGames}
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-4 text-center sm:p-5">
              <p className="text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-purple-400 sm:text-4xl">
                {completed}
              </p>
            </div>
            <div className="rounded-xl bg-gray-900 p-4 text-center sm:p-5">
              <p className="text-gray-400 text-sm mb-1">Avg rating</p>
              <p className="text-3xl font-bold text-yellow-400 sm:text-4xl">
                {avgRating}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
            {/* Status breakdown - custom CSS bars */}
            <div className="rounded-xl bg-gray-900 p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-6">Games by status</h2>

              {/* Stacked bar */}
              <div className="flex rounded-full overflow-hidden h-6 mb-6">
                {statusData.map((item) => (
                  <div
                    key={item.name}
                    className={`${STATUS_COLORS[item.name]} transition-all`}
                    style={{ width: `${(item.value / totalGames) * 100}%` }}
                    title={`${item.name}: ${item.value}`}
                  />
                ))}
              </div>

              {/* Status list */}
              <div className="flex flex-col gap-3">
                {statusData.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className={`h-3 w-3 shrink-0 rounded-full ${STATUS_COLORS[item.name]}`}
                      />
                      <span className="truncate text-sm text-gray-300">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-2 w-16 rounded-full bg-gray-800 min-[375px]:w-24 sm:w-32">
                        <div
                          className={`${STATUS_COLORS[item.name]} h-2 rounded-full`}
                          style={{
                            width: `${(item.value / totalGames) * 100}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`w-5 text-right text-sm font-semibold ${STATUS_TEXT_COLORS[item.name]}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top genres - custom CSS bars */}
            <div className="rounded-xl bg-gray-900 p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-6">Top genres</h2>
              {genreData.length === 0 ? (
                <p className="text-gray-400 text-sm">No genre data yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {genreData.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-sm">
                        <span className="truncate text-gray-300">
                          {item.name}
                        </span>
                        <span className="font-semibold text-purple-400">
                          {item.value}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(item.value / maxGenreCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Stats;
