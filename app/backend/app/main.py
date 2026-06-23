from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, SessionLocal, Base
from app.seeds.seed import seed_db
from app.routers.routers import router

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed database on startup
db = SessionLocal()
try:
    seed_db(db)
finally:
    db.close()

app = FastAPI(
    title="Market Lab PoC API",
    description="Backend API for synthetic concept and message testing platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For PoC, allow all origins. Can be restricted to localhost:5173 later if needed.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Market Lab PoC API is active. Go to /docs for Swagger UI."}
