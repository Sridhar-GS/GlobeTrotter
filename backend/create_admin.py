import sys
import os

# Add the parent directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

def create_admin_user():
    db = SessionLocal()
    try:
        email = "admin@globetrotter.com"
        password = "admin"
        
        # Check if user exists
        stmt = select(User).where(User.email == email)
        existing_user = db.execute(stmt).scalar_one_or_none()
        
        if existing_user:
            print(f"User {email} already exists. Updating to admin...")
            existing_user.is_admin = True
            existing_user.password_hash = hash_password(password) # Reset password to ensure access
            db.commit()
            print(f"User {email} updated. Password is '{password}'")
        else:
            print(f"Creating new admin user {email}...")
            new_user = User(
                email=email,
                password_hash=hash_password(password),
                name="Admin User",
                is_admin=True
            )
            db.add(new_user)
            db.commit()
            print(f"Admin user created. Email: {email}, Password: {password}")
            
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
