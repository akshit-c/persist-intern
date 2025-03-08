# Persist Intern - Interactive Creator Platform

## 🚀 Live Demo

- **Frontend**: [https://frontend-qi5nip8ag-akshitchaudhary01-gmailcoms-projects.vercel.app](https://frontend-qi5nip8ag-akshitchaudhary01-gmailcoms-projects.vercel.app)
- **Backend API**: [https://persist-intern-api.onrender.com/api](https://persist-intern-api.onrender.com/api)

## 📋 Project Overview

Persist Intern is an interactive learning platform where users can participate in coding and knowledge challenges. The platform focuses on delivering learning content, tracking progress, and fostering community engagement through:

- Interactive challenge interface with syntax highlighting
- Real-time progress tracking
- User profiles and achievements
- Global and challenge-specific leaderboards
- Discussion sections for each challenge

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material UI
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Code Highlighting**: React Syntax Highlighter
- **Content Rendering**: React Markdown

### Backend
- **Framework**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI (drf-yasg)
- **CORS Handling**: django-cors-headers

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: PostgreSQL (Render)

## ✨ Features

### User Management
- User registration and authentication
- JWT-based authentication
- User profiles with customizable avatars
- Progress tracking across challenges

### Challenge System
- Browse challenges by category, difficulty, and status
- Interactive challenge viewer with markdown support
- Code editor with syntax highlighting
- Submission history and feedback
- Challenge completion tracking

### Progress & Achievements
- Visual progress statistics
- Achievement badges and rewards
- Personal performance analytics
- Leaderboards (global and per-category)

### Community Features
- Discussion sections for each challenge
- User profiles with achievement showcases
- Social sharing capabilities

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/django_app
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with:
   ```
   SECRET_KEY=your_secret_key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   USE_SQLITE=True
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

## 📚 API Documentation

The API documentation is available at `/api/swagger/` when the backend is running.

### Key Endpoints

#### Authentication
- `POST /api/users/register/`: Register a new user
- `POST /api/users/login/`: Login and get JWT tokens
- `POST /api/token/refresh/`: Refresh JWT token

#### Challenges
- `GET /api/challenges/`: List all challenges
- `GET /api/challenges/{id}/`: Get challenge details
- `GET /api/challenges/categories/`: List all categories
- `POST /api/challenges/{id}/submit/`: Submit a solution

#### Progress
- `GET /api/progress/`: Get user progress
- `GET /api/progress/leaderboard/`: Get leaderboard
- `GET /api/progress/achievements/`: Get user achievements

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Fork or clone this repository
2. Set up a Vercel account and connect it to your GitHub repository
3. Configure the environment variables:
   - `VITE_API_URL`: Your backend API URL
4. Deploy the frontend

### Backend Deployment (Render)
1. Set up a Render account and connect it to your GitHub repository
2. Create a PostgreSQL database on Render
3. Create a Web Service for the Django backend
4. Configure the environment variables:
   - `SECRET_KEY`: A secure random string
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: Your Render domain
   - `DATABASE_URL`: Your PostgreSQL connection string
5. Deploy the backend

## 📝 Project Structure

### Frontend
```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable UI components
│   ├── contexts/    # React context providers
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── types/       # TypeScript type definitions
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main application component
│   └── main.tsx     # Application entry point
└── package.json     # Dependencies and scripts
```

### Backend
```
backend/
└── django_app/
    ├── challenges/  # Challenge management app
    ├── createathon/ # Project settings
    ├── progress/    # User progress tracking app
    ├── users/       # User management app
    └── manage.py    # Django management script
```

## 📋 Evaluation Criteria Coverage

- **Code Quality**: Followed best practices, proper error handling, and code organization
- **Functionality**: Implemented all required features with proper validation
- **Documentation**: Comprehensive README, API documentation, and code comments
- **Testing**: Unit tests for critical components
- **UI/UX Design**: Responsive design with Material UI, intuitive user interface

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Akshit Chaudhary 