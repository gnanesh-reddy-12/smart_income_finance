# Backend

Flask application: authentication, sessions, and finance analysis API.

## Run

```bash
pip install -r requirements.txt
python app.py
```

Run from this folder, or from the repo root: `python backend/app.py`.

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| POST | `/api/analyze` | Analyze finances (requires login) |

User data is stored in `data/users.json`.
