import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:123456@localhost:5432/campusshield")
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Retry logic for cloud deployments where DB might take a few seconds to wake up
engine = None
retries = 5
while retries > 0:
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        # Attempt to connect to ensure it's actually alive
        with engine.connect() as conn:
            pass
        break
    except OperationalError:
        retries -= 1
        print(f"Database unavailable. Retrying in 3 seconds... ({retries} left)")
        time.sleep(3)

if not engine:
    raise Exception("Could not connect to the database after multiple retries.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
