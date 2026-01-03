import json
import pathlib
from sqlalchemy import select, text

from app.core.database import Base, SessionLocal, engine
from app.models.city import City
from app.models.attraction import Attraction


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    
    seed_dir = pathlib.Path(__file__).parent
    cities_path = seed_dir / "cities.json"
    attractions_path = seed_dir / "attractions.json"
    
    if not cities_path.exists() or not attractions_path.exists():
        print("Seed files not found. Please run scripts/generate_seed_data.py first.")
        return

    with open(cities_path, "r") as f:
        cities_data = json.load(f)
        
    with open(attractions_path, "r") as f:
        attractions_data = json.load(f)

    db = SessionLocal()
    try:
        print("Truncating cities and attractions tables...")
        db.execute(text("TRUNCATE TABLE attractions, cities RESTART IDENTITY CASCADE"))
        db.commit()
        
        print(f"Seeding {len(cities_data)} cities...")
        db.bulk_insert_mappings(City, cities_data)
        db.commit()
        
        print(f"Seeding {len(attractions_data)} attractions...")
        db.bulk_insert_mappings(Attraction, attractions_data)
        db.commit()
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
    print("Seed completed")
