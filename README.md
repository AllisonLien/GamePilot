# GamePilot 🎮
> Just PLAY it!
A game discovery and recommendation platform built with Node.js and Express.
**ITE5315 — Web Programming and Framework 1 | Summer 2026**  
Team: Yichun Lien, Maria Catherine Jaramillo, Yung-Lun Lee

---

## Setup
# 1. Clone the repo
git clone https://github.com/AllisonLien/GamePilot.git
cd GamePilot
# 2. Install dependencies
npm install
# 3. Create your .env file
cp .env.example .env
# 4. Run in development
npm run dev
# 5. Or run normally
npm start

App runs at **http://localhost:3000**
---
## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /`| Home page |
| GET | `/games` | Paginated game list (HTML) |
| GET | `/games/:id` | Single game detail (HTML) |
| GET | `/games/search?genre=&minRating=` | Search/filter games (HTML) |
| GET | `/api/games?page=1&perPage=10` | Paginated game list (JSON) |
| GET | `/api/games/:id` | Single game (JSON) |
| POST | `/api/games/suggest` | Submit a game suggestion |
| PUT | `/api/games/:id` | Update a game (simulated Phase 1) |
| GET | `/api/status` | Health/status check |

### Query Parameters
- `page` — page number (default: 1)
- `perPage` — results per page (default: 10, max: 50)
- `genre` — filter by genre (e.g. `RPG`, `Indie`)
- `minRating` — minimum rating score (e.g. `4.0`)

---

## Project Structure
GamePilot/
├── data/
│   └── games.json          # 1,512 cleaned game records
├── helpers/
│   └── gameHelper.js       # pagination, filter, lookup logic
├── middleware/
│   └── logger.js           # request logger
├── routes/
│   ├── games.js            # HTML routes
│   └── api.js              # JSON API routes
├── views/                  # EJS templates (Phase 2)
├── public/                 # static assets (CSS, images)
├── server.js               # app entry point
├── vercel.json             # Vercel deployment config
└── .env.example
---

## Dataset
**Popular Video Games** — sourced from Kaggle  
1,512 records | Fields: title, releaseDate, developer[], genres[], rating{}, communityStats{}, summary, imageUrl, isActive

---
## Deployment
Deployed on Vercel: *(link to be added)*
## Known Limitations (Phase 1)
- POST and PUT routes are simulated — no file persistence yet (Phase 2)
- EJS template views coming in Phase 2
- Images use placeholder URLs
