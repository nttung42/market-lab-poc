# Market Lab PoC

Market Lab PoC is a synthetic concept/message testing application designed for comparing 2-3 product messages against structured buyer personas before human validation. The flow runs from project setup and persona profiling to synthetic respondent simulations and insight reporting.

---

## Quick Start (Using Makefile)

If you have `make` installed on your system, you can use these shortcuts:

### 1. Project Setup
Initialize python virtual environment, install backend packages, and install frontend node packages:
```bash
make setup
```

### 2. Start Backend API Server
Launch the FastAPI uvicorn server (running at `http://127.0.0.1:8000`):
```bash
make start-backend
```

### 3. Start Frontend Dev Server
Launch the Vite React dev server (running at `http://localhost:5173/`):
```bash
make start-frontend
```

### 4. Run Backend Tests
Execute Python tests using `pytest`:
```bash
make test
```

---

## Manual Execution (Without Makefile)

If you don't have `make` installed, run these standard commands:

### 1. Setup Backend
```bash
# Create python virtual environment
python -m venv app/backend/.venv

# Activate virtual environment (Windows Powershell)
.\app\backend\.venv\Scripts\Activate.ps1

# Activate virtual environment (macOS/Linux/Git Bash)
source app/backend/.venv/bin/activate

# Install dependencies
pip install -r app/backend/requirements.txt
```

### 2. Setup Frontend
```bash
cd app/frontend
npm install
```

### 3. Run Backend API Server
```bash
# (Ensure your Python virtual environment is activated)
uvicorn app.main:app --app-dir app/backend --reload --port 8000 --host 127.0.0.1
```

Backend AI config lives in `app/backend/.env`. LiteLLM aliases can use either `GROQ_API_KEY` or `OPENROUTER_API_KEY`, for example:

```text
OPENROUTER_API_KEY=...
LLM_ALIAS_PERSONA_DRAFTER_PROVIDER=openrouter
LLM_ALIAS_PERSONA_DRAFTER_MODEL=openai/gpt-4o-mini
```

### 4. Run Frontend Server
```bash
cd app/frontend
npm run dev
```

### 5. Run Tests
```bash
pytest app/backend/app/tests/
```

---

## Project Structure

```text
market-lab-poc/
├── app/
│   ├── backend/          # FastAPI application & SQLAlchemy DB logic
│   │   ├── app/
│   │   │   ├── db/       # SQLite connection config
│   │   │   ├── models/   # SQL Database models (Project, Persona)
│   │   │   ├── schemas/  # Pydantic schema validation
│   │   │   ├── seeds/    # Idempotent seeding logic
│   │   │   └── tests/    # Pytest unit tests
│   │   └── requirements.txt
│   └── frontend/         # React, Vite, Tailwind CSS v4 & TypeScript
│       ├── src/
│       │   ├── api/      # Fetch API clients
│       │   ├── pages/    # ProjectOverview & PersonaCatalog views
│       │   ├── App.tsx   # Shell layout (Header, Nav, Footer)
│       │   └── index.css # Tailwind theme tokens and configurations
│       └── package.json
├── data/                 # Local SQLite database directory (market_lab.db, test_market_lab.db)
├── docs/                 # Product and specifications documentation
├── Makefile              # Dev task orchestration
└── README.md             # This guide
```

---

## Core Technologies & Guidelines

- **Backend**: FastAPI, SQLAlchemy (SQLite), Pydantic. SQLite databases are persisted inside the `data/` folder at the root of the project.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4. The user interface uses a clean academic-startup hybrid styling (Light Theme) conforming to `app/frontend/DESIGN_SYSTEM.md`.
- **Disclaimer**: All generated personas, objections, and buying behaviors are simulated assets (synthetic research) and require real-world human customer research validation.
