import pathlib
from sqlalchemy import create_engine, text
from app.core.config import get_settings

def main() -> None:
    settings = get_settings()
    engine = create_engine(settings.database_url, pool_pre_ping=True)

    repo_root = pathlib.Path(__file__).resolve().parents[2]
    migration_path = repo_root / "database" / "migrate_2026_01_cities_attractions.sql"
    if not migration_path.exists():
        raise SystemExit(f"Migration file not found: {migration_path}")

    sql = migration_path.read_text(encoding="utf-8")

    statements = [s.strip() for s in sql.split(";") if s.strip()]

    with engine.begin() as conn:
        for stmt in statements:
            print(f"Executing: {stmt[:50]}...")
            conn.execute(text(stmt))

    print(f"Applied migration successfully: {migration_path}")

if __name__ == "__main__":
    main()
