import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import Base, engine
# Import all models to ensure they are registered with Base.metadata
from app.models.activity import Activity
from app.models.attraction import Attraction
from app.models.city import City
from app.models.expense import Expense
from app.models.community_post import CommunityPost
from app.models.shared_trip import SharedTrip
from app.models.stop import Stop
from app.models.trip import Trip
from app.models.user import User

from app.seed.seed_runner import run_seed
from create_admin import create_admin_user

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Running seed data...")
    run_seed()
    
    print("Creating admin user...")
    create_admin_user()
    
    print("Database reset complete!")

if __name__ == "__main__":
    reset_database()
