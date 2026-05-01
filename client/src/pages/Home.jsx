// This is the HOME PAGE - the first thing users see when they visit the app
// Like the title screen of a video game

import { Link } from 'react-router-dom'; // Link lets us navigate to other pages

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center text-center px-4">
      {/* Big title */}
      <h1 className="text-5xl font-bold text-purple-400 mb-4">🎮 GameLog</h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-400 mb-8 max-w-md">
        Track every game you've played, are playing, or want to play — all in
        one place.
      </p>

      {/* Call to action buttons */}
      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-purple-600 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;