// This is the MAIN component of our React app
// Think of it like the frame of a house - everything else goes inside it

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router lets us have multiple pages

function App() {
  return (
    // BrowserRouter wraps everything - it's what makes page navigation work
    <BrowserRouter>
      <Routes>
        {/* Each Route is like a door - the path is the address, the element is what's behind the door */}
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/register" element={<h1>Register</h1>} />
        <Route path="/library" element={<h1>Library</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;