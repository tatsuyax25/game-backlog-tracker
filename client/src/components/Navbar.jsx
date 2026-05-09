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
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      {/* Logo - clicking it goes to the home page */}
      <Link to="/" className="text-xl font-bold text-purple-400">
        🎮 GameLog
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          // If logged in, show Library link and Logout button
          <>
            <Link to="/library" className="hover:text-purple-400 transition">
              My Library
            </Link>
            <Link to="/stats" className="hover:text-purple-400 transition">
              Stats
            </Link>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
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
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
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