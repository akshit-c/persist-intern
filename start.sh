#!/bin/bash

# Start the Django backend server
echo "Starting Django backend server..."
cd backend/django_app
source venv/bin/activate
python manage.py runserver &
DJANGO_PID=$!
echo "Django server started with PID: $DJANGO_PID"

# Start the frontend development server
echo "Starting frontend development server..."
cd ../../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Both servers are running!"
echo "Django backend: http://127.0.0.1:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to kill processes on exit
function cleanup {
  echo "Stopping servers..."
  kill $DJANGO_PID
  kill $FRONTEND_PID
  echo "Servers stopped"
  exit 0
}

# Register the cleanup function to be called on exit
trap cleanup INT

# Wait for user to press Ctrl+C
wait 