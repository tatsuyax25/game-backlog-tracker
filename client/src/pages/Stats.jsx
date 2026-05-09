// This is the STATS PAGE - shows fun statistics about your game library
// Like the stats screen in a video game that shows your playtime and achievements

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'; // Recharts is our charting library

// Colors for the pie chart slices
const STATUS_COLORS = {
  Playing: '#22c55e', // green
  Completed: '#a855f7', // purple
  Backlog: '#6b7280', // gray
  Dropped: '#ef4444', // red
  Wishlist: '#eab308', // yellow
};

function Stats() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch all games from the backend
    const fetchGames = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/library`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(res.data);
      } catch (err) {
        console.log(err);
        console.error('Failed to load stats');
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

  // Calculate stats from the games list
  const totalGames = games.length;
  const completed = games.filter((g) => g.status === 'Completed').length;
  const avgRating = games.filter((g) => g.rating > 0).length > 0
    ? (games.reduce((sum, g) => sum + g.rating, 0) / games.filter((g) => g.rating > 0).length).toFixed(1)
    : 'N/A';

  // Data for the pie chart - games by status
  const statusData = ['Playing', 'Completed', 'Backlog', 'Dropped', 'Wishlist']
    .map((status) => ({
      name: status,
      value: games.filter((g) => g.status === status).length,
    }))
    .filter((item) => item.value > 0); // Only show statuses that have games

  // Data for the bar chart - top genres
  const genreCounts = {};
  games.forEach((game) => {
    if (game.genre) {
      // Split genres by comma since a game can have multiple
      game.genre.split(',').forEach((g) => {
        const genre = g.trim();
        if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  // Sort genres by count and take top 5
  const genreData = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
  
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      {/* Page header */}
      <h1 className="text-3xl font-bold text-purple-400 mb-8">My Stats</h1>

      {/* Empty state */}
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
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-900 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">Total games</p>
              <p className="text-4xl font-bold text-white">{totalGames}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-4xl font-bold text-purple-400">{completed}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">Avg rating</p>
              <p className="text-4xl font-bold text-yellow-400">{avgRating}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie chart - games by status */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Games by status</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-2">
                {statusData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: STATUS_COLORS[entry.name] }}
                    />
                    <span className="text-xs text-gray-400">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart - top genres */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Top genres</h2>
              {genreData.length === 0 ? (
                <p className="text-gray-400 text-sm">No genre data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={genreData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Stats;