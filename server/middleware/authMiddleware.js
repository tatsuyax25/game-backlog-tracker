// This is the BOUNCER at the door
// Before you can see your library, it checks if you have a valid ticket (JWT token)

const jwt = require('jsonwebtoken'); // JWT makes and checks our "tickets" (tokens)

const protect = (req, res, next) => {
  // Look for the ticket in the request headers (like checking for a wristband)
  const authHeader = req.headers.authorization;

  // If there's no ticket at all, send them away
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Pull the actual ticket out (remove the "Bearer " part)
  const token = authHeader.split(' ')[1];

  try {
    // Check if the ticket is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Stamp the request with who this person is
    next(); // Ticket is valid! Let them through
  } catch (err) {
    // Ticket is fake or expired - send them away
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;