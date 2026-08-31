import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
  const [form, setForm] = useState({ name: '', bio: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    axios.get(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setProfile(data);
        setForm(f => ({ ...f, name: data.name, bio: data.bio || '', email: data.email }));
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword)
      return setMessage({ text: 'New passwords do not match', error: true });

    const payload = {};
    if (form.name !== profile.name) payload.name = form.name;
    if (form.bio !== (profile.bio || '')) payload.bio = form.bio;
    if (form.email !== profile.email) payload.email = form.email;
    if (form.newPassword) payload.newPassword = form.newPassword;
    if (payload.email || payload.newPassword) payload.currentPassword = form.currentPassword;

    if (!Object.keys(payload).length)
      return setMessage({ text: 'No changes to save', error: false });

    setLoading(true);
    try {
      const { data } = await axios.put(`${API}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('name', data.name);
      setProfile(p => ({ ...p, name: data.name, email: data.email, bio: data.bio }));
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setMessage({ text: 'Profile updated successfully!', error: false });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed', error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 text-2xl font-bold text-purple-400">Account Settings</h1>

        {message.text && (
          <div className={`mb-6 rounded-lg px-4 py-3 text-sm ${message.error ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Info */}
          <section className="rounded-xl bg-gray-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-200">Profile</h2>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Display Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Bio <span className="text-gray-600">(max 300 chars)</span></label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength={300}
                rows={3}
                placeholder="Tell others a bit about yourself..."
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="mt-1 text-right text-xs text-gray-600">{form.bio.length}/300</p>
            </div>
          </section>

          {/* Email */}
          <section className="rounded-xl bg-gray-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-200">Change Email</h2>
            <div>
              <label className="mb-1 block text-sm text-gray-400">New Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </section>

          {/* Password */}
          <section className="rounded-xl bg-gray-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-200">Change Password</h2>
            <div>
              <label className="mb-1 block text-sm text-gray-400">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </section>

          {/* Current password — shown only when changing email or password */}
          {(form.email !== profile.email || form.newPassword) && (
            <section className="rounded-xl border border-yellow-700/50 bg-yellow-900/20 p-6">
              <label className="mb-1 block text-sm text-yellow-400">Current Password <span className="text-yellow-600">(required to change email or password)</span></label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </section>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold transition hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
