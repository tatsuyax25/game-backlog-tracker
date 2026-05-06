// This is the EDIT GAME MODAL - opens when the user clicks on a game card
// Like the options screen where you can update your game's status, rating, and notes

import { useState } from 'react';
import axios from 'axios';

function EditGameModal({ game, onClose, onUpdate, onDelete }) {
  // Pre-fill the form with the game's current data
  const [status, setStatus] = useState(game.status);
  const [rating, setRating] = useState(game.rating);
  const [notes, useNotes] = useState(game.notes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false); // Track delete confirmation

  const token = localStorage.getItem('token'); // Our JWT ticket

  // This runs when the user clicks "Save changes"
  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/library/${game._id}`,
        { status, rating, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data); // Send the updated game back to the Library page
      onClose();          // Close the modal
    } catch (err) {
      console.error(err);
      setError('Failed to update game. Play try again.');
    } finally {
      setLoading(false);
    }
  };

  
}