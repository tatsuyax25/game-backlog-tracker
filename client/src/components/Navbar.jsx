// This is the NAVIGATION BAR that appears at the top of every page
// Like the menu bar at the top of a video game - always visible no matter where you are

import { Link, useNavigate } from 'react-router-dom'; // Link is like a <a> tag but for React Router

function Navbar() {
  const navigate = useNavigate(); // This lets us redirect the user to a different page

  // This function runs when the user clicks "Logout"
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove their JWT ticket
    localStorage.removeItem('name');  // Remove their name
    navigate('/login');              // Send them back to the login page
  };

  // Check if the user is logged in by looking for their token
  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="flex flex-col gap-3 bg-gray-900 px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
      {/* Logo - clicking it goes to the home page */}
      <Link to="/" className="shrink-0 text-xl font-bold text-purple-400">
        🎮 GameLog
      </Link>

      {/* Navigation links */}
      <div className="flex w-full flex-wrap items-center gap-3 text-sm sm:w-auto sm:gap-4 sm:text-base">
        {isLoggedIn ? (
          // If logged in, show Library link and Logout button
          <>
            <Link
              to="/library"
              className="hover:text-purple-400 transition text-sm"
            >
              Library
            </Link>
            <Link to="/stats" className="hover:text-purple-400 transition">
              Stats
            </Link>
            <button
              onClick={handleLogout}
              className="ml-auto rounded-lg bg-purple-600 px-3 py-2 transition hover:bg-purple-700 sm:ml-0 sm:px-4"
            >
              Logout
            </button>
          </>
        ) : (
          // If not logged in, show Login and Register links
          <>
            <Link to="/login" className="hover:text-purple-400 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="ml-auto rounded-lg bg-purple-600 px-3 py-2 transition hover:bg-purple-700 sm:ml-0 sm:px-4"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
