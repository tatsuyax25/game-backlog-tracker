# 🎮 GameLog — Game Backlog Tracker

A full-stack MERN application that lets you track every game you've played, are playing, or want to play — all in one place.

🔗 **Live Demo:** [gamebacklogtracker.netlify.app](https://gamebacklogtracker.netlify.app)

---

## 📸 Screenshots

### Home
![Home](https://i.imgur.com/KB4nv0f.png)

### Library
![Library](https://i.imgur.com/AJAgV8B.png)

### Search
![Search](https://i.imgur.com/G3iTu4N.png)

### Stats
![Stats](https://i.imgur.com/v08s0yi.png)

### Login
![Login](https://i.imgur.com/FQrJcEN.png)

---

## 🚀 Features

- 🔐 **User Authentication** — Secure register & login with JWT and bcrypt
- 🔍 **Game Search** — Search any game using the RAWG API with cover art, genre, and platform data
- 📚 **Game Library** — Add games with statuses: Playing, Completed, Backlog, Dropped, or Wishlist
- ⭐ **Ratings & Notes** — Rate games 1–5 stars and add personal notes
- 🔽 **Filter & Sort** — Filter by status and sort by date, title, or rating
- 📊 **Stats Dashboard** — Visual breakdown of your library by status and top genres
- 📱 **Responsive Design** — Fully optimized for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router v6
- Tailwind CSS
- Axios

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

### External API
- [RAWG Video Games Database API](https://rawg.io/apidocs)

### Deployment
- Frontend: [Netlify](https://netlify.com)
- Backend: [Render](https://render.com)
- Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- RAWG API key (free at [rawg.io/apidocs](https://rawg.io/apidocs))

### 1. Clone the repository
```bash
git clone https://github.com/tatsuyax25/game-backlog-tracker.git
cd game-backlog-tracker
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in the `/server` folder:
```
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `/client` folder:
```
VITE_API_URL=http://localhost:8000/api
VITE_RAWG_API_KEY=your_rawg_api_key
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables

### Server (`/server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default: 8000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

### Client (`/client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_RAWG_API_KEY` | RAWG API key |

---

## 📁 Project Structure

```
game-backlog-tracker/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, GameSearchModal, EditGameModal
│   │   ├── pages/           # Home, Login, Register, Library, Stats
│   │   └── App.jsx
│   └── package.json
└── server/                  # Express backend
    ├── controllers/         # authController, libraryController
    ├── middleware/          # authMiddleware (JWT)
    ├── models/              # User, GameEntry
    ├── routes/              # authRoutes, libraryRoutes
    └── server.js
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Library (Protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/library` | Get all games for logged-in user |
| POST | `/api/library` | Add a new game |
| PUT | `/api/library/:id` | Update a game entry |
| DELETE | `/api/library/:id` | Remove a game |

---

## 👨‍💻 Author

**Miguel Urena**
- Portfolio: [miguelurenaportfolio.netlify.app](https://miguelurenaportfolio.netlify.app)
- GitHub: [@tatsuyax25](https://github.com/tatsuyax25)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
