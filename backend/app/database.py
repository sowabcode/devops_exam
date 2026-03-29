import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Local
# SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin123@localhost:5432/dbbibliotheque"

# Docker Compose
SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin123@postgres_server:5432/dbdit"
# SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin123@localhost:5432/dbdit"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "client_encoding": "utf8",
        "options": "-c client_encoding=utf8"
    },
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
