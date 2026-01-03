# GlobeTrotter

Personalized multi-city travel planning (React + FastAPI + PostgreSQL).

## Quickstart

### Backend

1. Create a Postgres database.
2. Copy env example and fill values:

```bash
cd backend
copy .env.example .env
```

1. Install deps and run:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Database schema updates

If you pulled newer code and see errors like `column users.first_name does not exist`, your Postgres database is older than the current models.

Use one of these options:

1) Recreate the database from scratch using `database/schema.sql`.

2) Upgrade an existing database by running:

```bash
psql "<your connection string>" -f database/migrate_2026_01_profile_expenses_community.sql
```

If you don't have `psql` installed, you can apply the migration using Python:

```bash
cd backend
python -m scripts.apply_migration
```

This migration adds new user profile columns (e.g. `first_name`, `language`), the expenses date column, and the community posts table.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend expects the API at `http://localhost:8000/api` by default.
