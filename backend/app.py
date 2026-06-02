import json
import os
from functools import wraps
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor

from flask import Flask, jsonify, request, send_from_directory, session
from werkzeug.security import check_password_hash, generate_password_hash

ROOT = Path(__file__).resolve().parent.parent
BACKEND = Path(__file__).resolve().parent
FRONTEND_DIST = ROOT / "frontend" / "dist"

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-change-me-in-production")

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)

    conn.commit()
    cur.close()
    conn.close()

init_db()

@app.get("/api/db-test")
def db_test():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT 1")
    result = cur.fetchone()
    cur.close()
    conn.close()

    return {"database": "connected", "result": result[0]}

def _cors_origins() -> list[str]:
    origins = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    vercel_url = os.environ.get("VERCEL_URL")
    if vercel_url:
        origins.append(f"https://{vercel_url}")
    return [o.strip() for o in origins if o.strip()]

CATEGORIES = [
    ("rent", "Rent"),
    ("food", "Food"),
    ("transport", "Transport"),
    ("subscriptions", "Subscriptions"),
    ("shopping", "Shopping"),
    ("others", "Others"),
]


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin and origin.strip() in _cors_origins():
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.route("/api/<path:_path>", methods=["OPTIONS"])
def api_options(_path):
    return "", 204

def _current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT email, name FROM users WHERE email = %s",
        (user_id,)
    )

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return None

    return {
        "email": row[0],
        "name": row[1]
    }


def _user_payload(user: dict) -> dict:
    return {"name": user.get("name", "User"), "email": user.get("email", "")}


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify({"error": "Please sign in first."}), 401
        return view(*args, **kwargs)

    return wrapped


def _safe_percent(amount: float, income: float) -> float:
    if income <= 0:
        return 0.0
    return round((amount / income) * 100, 2)


def _financial_status(score: int) -> str:
    if score >= 85:
        return "Excellent"
    if score >= 70:
        return "Good"
    if score >= 50:
        return "Needs Attention"
    return "Critical"


def analyze_finances(income: float, expenses: dict) -> dict:
    total_expenses = round(sum(expenses.values()), 2)
    savings = round(income - total_expenses, 2)
    savings_rate = _safe_percent(savings, income)

    score = 0
    if income > 0 and savings >= 0.2 * income:
        score += 30
    elif savings >= 0:
        score += 15

    if income > 0 and expenses["rent"] <= 0.4 * income:
        score += 25
    else:
        score -= 10

    if income > 0 and expenses["food"] <= 0.3 * income:
        score += 25
    else:
        score -= 10

    if income > 0 and expenses["shopping"] <= 0.15 * income:
        score += 20
    else:
        score -= 10

    score = max(0, min(100, score))
    suggestions = []

    if income <= 0:
        suggestions.append("Add a valid monthly income to get accurate recommendations.")
    if savings < 0:
        suggestions.append("You are overspending. Reduce non-essential categories immediately.")
    elif savings_rate < 20:
        suggestions.append("Target at least 20% savings by trimming subscriptions or shopping.")
    else:
        suggestions.append("Great savings discipline. Keep your emergency fund growing.")

    if _safe_percent(expenses["rent"], income) > 40:
        suggestions.append("Rent is high (>40% of income). Consider shared housing or renegotiation.")
    if _safe_percent(expenses["food"], income) > 30:
        suggestions.append("Food spending is elevated. Weekly meal planning can help lower costs.")
    if _safe_percent(expenses["shopping"], income) > 15:
        suggestions.append("Shopping is above healthy range. Set a fixed monthly shopping cap.")
    if _safe_percent(expenses["subscriptions"], income) > 10:
        suggestions.append("Review subscriptions and cancel services you barely use.")

    breakdown = []
    for key, label in CATEGORIES:
        amount = round(expenses[key], 2)
        breakdown.append(
            {
                "key": key,
                "label": label,
                "amount": amount,
                "percent_of_income": _safe_percent(amount, income),
            }
        )

    return {
        "income": round(income, 2),
        "total_expenses": total_expenses,
        "savings": savings,
        "savings_rate": savings_rate,
        "health_score": score,
        "status": _financial_status(score),
        "breakdown": breakdown,
        "suggestions": suggestions,
    }


@app.get("/api/users/me")
@login_required
def users_me():
    user = _current_user()
    return jsonify(_user_payload(user))


@app.post("/api/auth/register")
def register():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required."}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT email FROM users WHERE email = %s",
        (email,)
    )

    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify(
            {"error": "An account with this email already exists."}
        ), 409

    cur.execute(
        """
        INSERT INTO users (email, name, password_hash)
        VALUES (%s, %s, %s)
        """,
        (
            email,
            name,
            generate_password_hash(password)
        )
    )

    conn.commit()

    cur.close()
    conn.close()

    session["user_id"] = email

    return jsonify({
        "ok": True,
        "user": {
            "name": name,
            "email": email
        }
    })


@app.post("/api/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT email, name, password_hash
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return jsonify(
            {"error": "Invalid email or password."}
        ), 401

    db_email, db_name, password_hash = row

    if not check_password_hash(password_hash, password):
        return jsonify(
            {"error": "Invalid email or password."}
        ), 401

    session["user_id"] = db_email

    return jsonify({
        "ok": True,
        "user": {
            "name": db_name,
            "email": db_email
        }
    })


@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"ok": True})


@app.post("/api/analyze")
@login_required
def analyze():
    payload = request.get_json(silent=True) or {}
    income = float(payload.get("income", 0) or 0)
    if income < 0:
        return jsonify({"error": "Income cannot be negative."}), 400

    expenses = {}
    for key, _ in CATEGORIES:
        value = float(payload.get(key, 0) or 0)
        if value < 0:
            return jsonify({"error": f"{key.title()} cannot be negative."}), 400
        expenses[key] = value

    return jsonify(analyze_finances(income, expenses))


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404

    if not FRONTEND_DIST.exists():
        return jsonify(
            {
                "message": "React build not found. Run: cd frontend && npm install && npm run build. For dev use: npm run dev (port 5173).",
            }
        ), 503

    if path and (FRONTEND_DIST / path).is_file():
        return send_from_directory(FRONTEND_DIST, path)

    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
