// This is the MAIN component of our React app
// Think of it like the frame of a house - everything else goes inside it

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router lets us have multiple pages
import Navbar from './components/Navbar'; // Our navigation bar
import Home from './pages/Home'; // Home page
import Login from './pages/Login'; // Login page
import Register from './pages/Register'; // Register page
import Library from './pages/Library'; // Library page
import Stats from './pages/Stats'; // Stats page

import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/library" element={<Library />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;