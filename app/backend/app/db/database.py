import os
from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

# Resolve root data directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "market_lab.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@event.listens_for(engine, "connect")
def _configure_sqlite(dbapi_connection, connection_record) -> None:
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


def ensure_llm_call_log_schema() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("llm_call_logs"):
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("llm_call_logs")
    }
    required_columns = {
        "request_id": "VARCHAR",
        "user_id": "VARCHAR",
        "feature_name": "VARCHAR",
        "model": "VARCHAR",
        "input_tokens": "INTEGER",
        "output_tokens": "INTEGER",
        "cost": "FLOAT",
        "prompt_version": "VARCHAR",
        "tool_calls_count": "INTEGER",
        "error_type": "VARCHAR",
    }

    with engine.begin() as connection:
        for column_name, column_type in required_columns.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE llm_call_logs "
                        f"ADD COLUMN {column_name} {column_type}"
                    )
                )


def ensure_persona_schema() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("personas"):
        return

    existing_columns = {column["name"] for column in inspector.get_columns("personas")}
    required_columns = {
        "insight_profile": "JSON",
    }

    with engine.begin() as connection:
        for column_name, column_type in required_columns.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE personas "
                        f"ADD COLUMN {column_name} {column_type}"
                    )
                )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
