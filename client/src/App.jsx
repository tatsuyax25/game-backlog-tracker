// This is the MAIN component of our React app
// Think of it like the frame of a house - everything else goes inside it

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router lets us have multiple pages
import Navbar from './components/Navbar'; // Our navigation bar
import Home from './pages/Home'; // Home page
import Login from './pages/Login'; // Login page
import Register from './pages/Register'; // Register page
import Library from './pages/Library'; // Library page

function App() {
  return (
    // BrowserRouter wraps everything - it's what makes page navigation work
    <BrowserRouter>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Routes decide which page to show based on the URL */}
      <Routes>
        {/* Each Route is like a door - the path is the address, the element is what's behind the door */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;