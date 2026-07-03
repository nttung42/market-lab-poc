.PHONY: setup start-backend start-frontend start test check

setup:
	@echo "Setting up Python virtual environment..."
	python -m venv app/backend/.venv
	@echo "Installing backend dependencies..."
	./app/backend/.venv/Scripts/pip install -r app/backend/requirements.txt
	@echo "Installing frontend dependencies..."
	cd app/frontend && npm install

start-backend:
	@echo "Starting backend server..."
	./app/backend/.venv/Scripts/uvicorn app.main:app --app-dir app/backend --reload --port 8000 --host 0.0.0.0

start-frontend:
	@echo "Starting frontend dev server..."
	cd app/frontend && npm run dev -- --host 0.0.0.0

test:
	@echo "Running backend tests..."
	./app/backend/.venv/Scripts/pytest app/backend/app/tests/

check: test
	@echo "Full verification complete."
