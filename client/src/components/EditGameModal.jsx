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
}