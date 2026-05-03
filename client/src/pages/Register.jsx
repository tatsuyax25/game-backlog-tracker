// This is the REGISTER PAGE - where new users create an account
// Like the "New Game" screen on a video game

import { useState } from 'react'; // useState lets us track what the user types
import { Link, useNavigate } from 'react-router-dom'; // Link and useNavigate for navigation
import axios from 'axios'; // Axios sends requests to our backend

function Register() {
  // Track what the user types in the form
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // Store any error messages
  const [loading, setLoading] = useState(false); // Track if we're waiting for a response
  const navigate = useNavigate(); // Lets us redirect to another page

  // This runs every time the user types in a field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This runs when the user clicks the Register button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing
    setLoading(true); // We're now waiting for a response
    setError(''); // Clear any previous errors

    try {
      // Send the name, email, and password to our backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData
      );

      // Save the token and name in localStorage (like saving the game)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);

      // Redirect to the library page
      navigate('/library');
    } catch (err) {
      // Show an error message if something went wrong
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl font-bold text-purple-400 mb-2 text-center">
          Create an account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Start tracking your games today!
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Register form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name field */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Your name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              placeholder="Miguel"
            />
          </div>

          {/* Email field */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;