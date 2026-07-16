# GamePilot 🎮

> Just PLAY it!

A game discovery and recommendation platform built with Node.js and Express.js.

**ITE5315 — Web Programming and Framework 1 | Summer 2026**
Team: Yichun Lien, Maria Catherine Jaramillo, Yung-Lun Lee

---

## 🚀 Live Deployment

**Vercel:** https://game-pilot.vercel.app/

---

## ⚙️ Setup

```bash
# 1. Clone the repo
git clone https://github.com/AllisonLien/GamePilot.git
cd GamePilot

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Run in development (auto-restart on file changes)
npm run dev

# 5. Or run normally
npm start
```

App runs at **http://localhost:3000**

---

## 📁 Project Structure

```
GamePilot/
├── data/
│   └── games.json              # 1,512 cleaned game records
├── helpers/
│   └── gameHelper.js           # paginate, filter, lookup, addGame
├── middleware/
│   └── logger.js               # custom request logger
├── routes/
│   ├── games.js                # HTML routes (EJS views)
│   └── api.js                  # JSON API routes
├── views/
│   ├── partials/
│   │   ├── header.ejs          # shared navbar
│   │   └── footer.ejs          # shared footer
│   ├── games/
│   │   ├── index.ejs           # paginated game list
│   │   ├── detail.ejs          # single game detail
│   │   ├── search.ejs          # search/filter page
│   │   └── add.ejs             # game suggestion form
│   ├── index.ejs               # home page
│   └── 404.ejs                 # 404 error page
├── public/
│   └── css/
│       └── style.css           # dark gaming theme stylesheet
├── server.js                   # app entry point
├── vercel.json                 # Vercel deployment config
├── .env.example                # environment variable template
└── package.json
```

---

## 🗺️ Routes

### HTML Routes (Browser)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page |
| GET | `/games` | Paginated game catalogue (card grid) |
| GET | `/games/:id` | Single game detail page |
| GET | `/games/search` | Search and filter games |
| GET | `/games/add` | Game suggestion form |
| POST | `/games` | Submit game suggestion (with validation) |

### API Routes (JSON)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/games` | Paginated game list (JSON) |
| GET | `/api/games/:id` | Single game (JSON) |
| POST | `/api/games/suggest` | Submit a game suggestion (JSON) |
| PUT | `/api/games/:id` | Update a game record (simulated) |
| GET | `/api/status` | Health/status check |

### Query Parameters

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `page` | Page number | 1 | `?page=2` |
| `perPage` | Results per page (max 50) | 10 | `?perPage=20` |
| `genre` | Filter by genre | — | `?genre=RPG` |
| `minRating` | Minimum rating score | — | `?minRating=4.0` |

---

## 📊 Dataset

**Popular Video Games** — sourced from Kaggle
[https://www.kaggle.com/code/nttthanh/popular-video-games-eda](https://www.kaggle.com/code/nttthanh/popular-video-games-eda)

- **1,512 records** after cleaning
- **Fields:** `id`, `title`, `releaseDate`, `developer[]`, `genres[]`, `rating{}`, `communityStats{}`, `summary`, `imageUrl`, `isActive`
- **Nested objects:** `rating { score, reviewCount }` and `communityStats { plays, playing, backlogs, wishlist }`
- **Array fields:** `developer[]` and `genres[]`

---

## 🧪 API Testing

**Postman Collection:**
https://web.postman.co/workspace/My-Workspace~6d5b9cc1-f3e7-4534-8f67-9133ecc414b2/collection/55901536-3e6ba609-6277-464a-98a9-741163134d59

The collection includes 13 saved requests covering all routes — GET, POST, PUT, success cases, and error/validation cases.

---

## 🔗 Project Links

| Resource | Link |
|----------|------|
| GitHub Repository | https://github.com/AllisonLien/GamePilot |
| Live Deployment (Vercel) | https://game-pilot.vercel.app/ |
| Trello Board | https://trello.com/invite/b/6a2313929711283072bcf4b0/ATTI3187bbcb0f9f84760b99ce571296d51416C89CAB/gamepilot |
| Postman Collection | https://web.postman.co/workspace/My-Workspace~6d5b9cc1-f3e7-4534-8f67-9133ecc414b2/collection/55901536-3e6ba609-6277-464a-98a9-741163134d59 |

---

## ⚠️ Known Limitations (Release 1)

- `POST /api/games/suggest` returns a mock response — no database persistence yet (planned for Release 2)
- `PUT /api/games/:id` simulates an update — changes are not permanently saved (planned for Release 2)
- Game cover images use placeholder URLs (`placehold.co`) — real cover art via a game API planned for Release 2

---

## 🔮 Planned for Release 2

- MongoDB Atlas integration for full CRUD persistence
- User authentication and JWT-based sessions
- Real game cover images via RAWG API
- Advanced multi-filter search (genre + rating + release year)
- Improved API documentation (Swagger/OpenAPI)
