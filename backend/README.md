# GlobeTrotter Backend (FastAPI)

## Run

```bash
cd backend
copy .env.example .env
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Seed cities

```bash
python -m app.seed.seed_runner
```
