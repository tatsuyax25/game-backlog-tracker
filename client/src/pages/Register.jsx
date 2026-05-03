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
}

export default Register;