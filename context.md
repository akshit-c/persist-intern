# Full Stack Developer Onboarding Assignment - Createathon

## Createathon: Interactive Creator Platform

### Project Overview

Create an interactive learning platform where users can participate in coding and knowledge challenges, with seamless integration between a web interface and a Telegram bot. The platform will focus on delivering learning content, tracking progress, and fostering community engagement.

## Tech Stack

The project will be built using the following technologies:

### Frontend
- Vite + React
- Next.js for server-side rendering

### BOT (Bonus Points)
- Telegram bot or mini app

### Backend
- Django for core business logic
- FastAPI for high-performance microservices

### Database
- PostgreSQL for reliable data storage

### API Architecture
- RESTful APIs for client-server communication

### Auth
- JWT Token

## Technical Architecture

### Frontend (Vite + React)
The frontend will provide an intuitive interface for users to interact with challenges, view leaderboards, and manage their progress. Key features include:

1. **Challenge Interface**
    - Interactive challenge viewer with syntax highlighting
    - Real-time progress tracking
    - Submission history and feedback display
    - Markdown support for challenge content
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

### Backend (Django)
The Django backend will handle core business logic, authentication, and API endpoints:

#### Challenge Management
```python
# challenges/models.py
class Challenge(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(
        max_length=20,
        choices=[('beginner', 'Beginner'),
                ('intermediate', 'Intermediate'),
                ('advanced', 'Advanced')]
    )
    points = models.IntegerField()
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def validate_submission(self, submission):
        # Challenge-specific validation logic
        pass
```

#### User Progress Tracking
```python
# progress/models.py
class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('started', 'Started'),
                ('submitted', 'Submitted'),
                ('completed', 'Completed')]
    )
    attempts = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True)
```

### Database Schema (PostgreSQL)

#### Core Tables
- Users and Authentication
- Challenges and Categories
- User Progress and Submissions
- Achievements and Rewards

## Implementation Requirements

- Implement user authentication and authorization
- Create RESTful APIs for challenge management
- Develop responsive frontend components
- Integrate real-time updates using WebSocket
- Implement error handling and logging
- Write unit tests for critical components
- Document API endpoints and code

## Submission Guidelines

- Follow the provided code style guidelines
- Include setup instructions in `README.md`
- Provide the GitHub link
- Deploy a working app
- Create a video on Loom explaining the working

## Evaluation Criteria

| **Criteria**          | **Weight** |
|----------------------|------------|
| Code Quality        | 25%        |
| Functionality       | 30%        |
| Documentation       | 15%        |
| Testing            | 15%        |
| UI/UX Design       | 15%        |
| Bot (Bonus Point)  | 20%        |

