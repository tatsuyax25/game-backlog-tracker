// This is the LOGIN PAGE - where existing users sign in
// Like the "Continue Game" screen on a video game

import { useState } from 'react'; // useState lets us track what the user types
import { Link, useNavigate } from 'react-router-dom'; // Link and useNavigate for navigation
import axios from 'axios'; // Axios sends requests to our backend

function Login() {
  // Track what the user types in the form
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Store any error messages
  const [loading, setLoading] = useState(false); // Track if we're waiting for a response
  const navigate = useNavigate(); // Lets us redirect to another page

  // This runs every time the user types in the field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This runs when the user clicks the Login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing
    setLoading(true); // We're now waiting for a response
    setError(''); // Clear any previous errors

    try {
      // Send the email and password to our backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
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
          Welcome back
        </h2>
        <p className="text-gray-400 text-center mb-6">Sign in to your library</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email field */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          
        </form>
      </div>
    </div>
  )
}