
import sys
import os
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.user import User
from app.models.city import City

db = SessionLocal()
try:
    user_count = db.query(User).count()
    city_count = db.query(City).count()
    print(f"Users: {user_count}")
    print(f"Cities: {city_count}")
    
    admin = db.query(User).filter(User.email == "admin@globetrotter.com").first()
    if admin:
        print(f"Admin exists: {admin.email}, is_admin={admin.is_admin}")
    else:
        print("Admin user not found")

except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
