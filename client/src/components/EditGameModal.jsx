// This is the EDIT GAME MODAL - opens when the user clicks on a game card
// Like the options screen where you can update your game's status, rating, and notes

import { useState } from 'react';
import axios from 'axios';

function EditGameModal({ game, onClose, onUpdate, onDelete }) {
  // Pre-fill the form with the game's current data
  const [status, setStatus] = useState(game.status);
  const [rating, setRating] = useState(game.rating);
  const [notes, setNotes] = useState(game.notes);
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

  // This runs when the user confirms delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/library/${game._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDelete(game._id); // Tell the Library page to remove this game
      onClose();          // Close the modal
    } catch (err) {
      console.log(err);
      setError('Failed to delete game. Play try again.');
    } finally {
      setLoading(false);
    }
  };

  // Status options
  const statuses = ['Playing', 'Completed', 'Backlog', 'Dropped', 'Wishlist'];

  return (
    // Dark overlay behind the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-70 px-4 py-6">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-gray-900 p-4 sm:p-6">
        {/* Game info header */}
        <div className="flex gap-4 mb-5">
          {game.coverImage ? (
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎮</span>
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-white">
              {game.title}
            </h2>
            <p className="text-sm text-gray-400">
              {game.genre} · {game.platform}
            </p>
            <p className="text-sm text-gray-400">{game.releaseYear}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mb-5" />

        {/* Error message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Status selector */}
        <div className="mb-5">
          <p className="text-sm text-gray-400 mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  status === s
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Star rating */}
        <div className="mb-5">
          <p className="text-sm text-gray-400 mb-2">Your rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star === rating ? 0 : star)} // Click same star to deselect
                className={`min-h-10 min-w-10 text-2xl transition ${
                  star <= rating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Notes textarea */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add your thoughts about this game..."
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Action buttons */}
        {showConfirm ? (
          // Delete confirmation
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm mb-3">
              Are you sure you want to remove this game?
            </p>
            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 py-2 text-sm font-semibold transition hover:bg-red-700 disabled:opacity-50"
              >
                Yes, remove it
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg bg-gray-700 py-2 text-sm font-semibold transition hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
            {/* Remove button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-lg border border-red-500 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:bg-opacity-10"
            >
              Remove
            </button>
            {/* Cancel button */}
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-700 py-2 text-sm font-semibold transition hover:bg-gray-600"
            >
              Cancel
            </button>
            {/* Save button */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-lg bg-purple-600 py-2 text-sm font-semibold transition hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditGameModal;
