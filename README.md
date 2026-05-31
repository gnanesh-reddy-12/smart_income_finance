# Smart Finance Dashboard

Employee personal finance analyzer — **React** frontend + **Flask** API.

## Project layout

```text
Salary-Prediction/
├── backend/           # Flask API (auth, analyze)
├── frontend/          # React + Vite (UI)
└── ml_pipeline/       # Future ML features
```

## Quick start (development)

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Pages (React)

| Route | Screen |
|-------|--------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Sidebar: Overview · Analyze month · Insights |
