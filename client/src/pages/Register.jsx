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
}

export default Register;