# Smart Finance — React frontend

Same UI as before: login, register, dashboard with sidebar (Overview, Analyze, Insights).

## Development (recommended)

Run **two terminals**:

```bash
# Terminal 1 — API
python backend/app.py

# Terminal 2 — React
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to Flask on port 5000.

## Production build

```bash
cd frontend
npm install
npm run build
python backend/app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) — Flask serves the built app from `frontend/dist/`.

## Structure

```text
src/
├── components/     layout, charts, auth, dashboard widgets
├── context/        AuthContext
├── pages/          Login, Register, Dashboard
├── pages/views/    Overview, Analyze, Insights
├── services/       api.js
├── styles/         App stylesheets
└── utils/
```
