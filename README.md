# Createathon: Interactive Creator Platform

An interactive learning platform where users can participate in coding and knowledge challenges, with seamless integration between a web interface and a Telegram bot.

## Project Structure

- `frontend/` - React application built with Vite and Next.js
- `backend/django_app/` - Django backend for core business logic
- `backend/fastapi_app/` - FastAPI microservices for high-performance operations

## Tech Stack

- **Frontend**: Vite + React, Next.js
- **Backend**: Django, FastAPI
- **Database**: PostgreSQL (with SQLite fallback for development)
- **Authentication**: JWT
- **Bot**: Telegram bot (optional)

## Quick Start

For the easiest setup, use the provided start script:

```bash
# Make the script executable (if not already)
chmod +x start.sh

# Run both frontend and backend servers
./start.sh
```

This will start both the Django backend server and the frontend development server.

- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000

## Manual Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+
- PostgreSQL (optional, SQLite is used by default)
- Virtual environment tool (venv, conda, etc.)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Django Backend Setup
```bash
cd backend/django_app
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### FastAPI Backend Setup (Optional)
```bash
cd backend/fastapi_app
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Features

1. **Challenge Interface**
   - Interactive challenge viewer with syntax highlighting
   - Real-time progress tracking
   - Submission history and feedback display
   - Code editor for programming challenges

2. **User Dashboard**
   - Progress overview with visual statistics
   - Completed and ongoing challenges
   - Achievement badges and rewards
   - Personal performance analytics

3. **Community Features**
   - Global and challenge-specific leaderboards
   - Discussion sections for each challenge
   - User profiles with achievement showcases
   - Social sharing capabilities

## API Documentation

API documentation is available at `/api/docs` when running the backend servers.

## Troubleshooting

- If you encounter any issues with the frontend, make sure you're running the commands from the `frontend` directory.
- If you encounter any issues with the backend, make sure you're running the commands from the `backend/django_app` directory.
- Make sure both the frontend and backend servers are running simultaneously for the application to work properly. 