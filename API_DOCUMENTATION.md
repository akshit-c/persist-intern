# API Documentation

This document provides detailed information about the Persist Intern API endpoints, request/response formats, and authentication.

## Base URL

```
https://persist-intern-api.onrender.com/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication.

### Getting a Token

**Endpoint**: `POST /users/login/`

**Request Body**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "your_email@example.com"
  }
}
```

### Refreshing a Token

**Endpoint**: `POST /token/refresh/`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Using Authentication

Include the access token in the Authorization header for authenticated requests:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## User Management

### Register a New User

**Endpoint**: `POST /users/register/`

**Request Body**:
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password",
  "confirm_password": "secure_password"
}
```

**Response**:
```json
{
  "id": 1,
  "username": "new_user",
  "email": "user@example.com",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Get User Profile

**Endpoint**: `GET /users/profile/`

**Authentication**: Required

**Response**:
```json
{
  "id": 1,
  "username": "your_username",
  "email": "your_email@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Software developer passionate about learning",
  "avatar": "https://example.com/media/avatars/profile.jpg",
  "date_joined": "2023-06-15T10:30:45Z"
}
```

### Update User Profile

**Endpoint**: `PUT /users/profile/`

**Authentication**: Required

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Software developer passionate about learning"
}
```

**Response**:
```json
{
  "id": 1,
  "username": "your_username",
  "email": "your_email@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Software developer passionate about learning",
  "avatar": "https://example.com/media/avatars/profile.jpg",
  "date_joined": "2023-06-15T10:30:45Z"
}
```

## Challenges

### List All Challenges

**Endpoint**: `GET /challenges/`

**Authentication**: Required

**Query Parameters**:
- `category` (optional): Filter by category ID
- `difficulty` (optional): Filter by difficulty (beginner, intermediate, advanced)
- `search` (optional): Search in title and description

**Response**:
```json
{
  "count": 10,
  "next": "https://persist-intern-api.onrender.com/api/challenges/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Introduction to Python",
      "description": "Learn the basics of Python programming",
      "difficulty": "beginner",
      "points": 100,
      "category": {
        "id": 1,
        "name": "Python"
      },
      "created_at": "2023-06-15T10:30:45Z",
      "status": "not_started"
    },
    // More challenges...
  ]
}
```

### Get Challenge Details

**Endpoint**: `GET /challenges/{id}/`

**Authentication**: Required

**Response**:
```json
{
  "id": 1,
  "title": "Introduction to Python",
  "description": "Learn the basics of Python programming",
  "content": "# Introduction to Python\n\nPython is a high-level, interpreted programming language...",
  "difficulty": "beginner",
  "points": 100,
  "category": {
    "id": 1,
    "name": "Python"
  },
  "created_at": "2023-06-15T10:30:45Z",
  "status": "not_started",
  "submissions": [
    {
      "id": 1,
      "content": "def hello_world():\n    print('Hello, World!')",
      "submitted_at": "2023-06-16T14:20:30Z",
      "status": "completed"
    }
  ]
}
```

### List Challenge Categories

**Endpoint**: `GET /challenges/categories/`

**Authentication**: Required

**Response**:
```json
[
  {
    "id": 1,
    "name": "Python",
    "description": "Python programming challenges"
  },
  {
    "id": 2,
    "name": "JavaScript",
    "description": "JavaScript programming challenges"
  },
  // More categories...
]
```

### Submit a Challenge Solution

**Endpoint**: `POST /challenges/{id}/submit/`

**Authentication**: Required

**Request Body**:
```json
{
  "content": "def hello_world():\n    print('Hello, World!')"
}
```

**Response**:
```json
{
  "id": 1,
  "challenge": {
    "id": 1,
    "title": "Introduction to Python"
  },
  "content": "def hello_world():\n    print('Hello, World!')",
  "submitted_at": "2023-06-16T14:20:30Z",
  "status": "completed"
}
```

### Get User Submissions

**Endpoint**: `GET /challenges/submissions/`

**Authentication**: Required

**Response**:
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "challenge": {
        "id": 1,
        "title": "Introduction to Python"
      },
      "content": "def hello_world():\n    print('Hello, World!')",
      "submitted_at": "2023-06-16T14:20:30Z",
      "status": "completed"
    },
    // More submissions...
  ]
}
```

## Progress

### Get User Progress

**Endpoint**: `GET /progress/`

**Authentication**: Required

**Response**:
```json
{
  "completed_challenges": 5,
  "total_challenges": 20,
  "total_points": 500,
  "rank": 10,
  "achievements": [
    {
      "id": 1,
      "name": "First Challenge",
      "description": "Completed your first challenge",
      "icon": "trophy"
    },
    // More achievements...
  ],
  "recent_activity": [
    {
      "challenge_id": 1,
      "title": "Introduction to Python",
      "action": "completed",
      "timestamp": "2023-06-16T14:20:30Z"
    },
    // More activities...
  ]
}
```

### Get Challenge Progress

**Endpoint**: `GET /progress/{challenge_id}/`

**Authentication**: Required

**Response**:
```json
{
  "challenge_id": 1,
  "title": "Introduction to Python",
  "status": "completed",
  "attempts": 2,
  "first_attempt_at": "2023-06-15T12:30:45Z",
  "completed_at": "2023-06-16T14:20:30Z",
  "time_spent": "1 day, 1 hour, 49 minutes, 45 seconds"
}
```

### Get Leaderboard

**Endpoint**: `GET /progress/leaderboard/`

**Authentication**: Required

**Query Parameters**:
- `category` (optional): Filter by category ID
- `timeframe` (optional): all, month, week

**Response**:
```json
[
  {
    "rank": 1,
    "user": {
      "id": 2,
      "username": "top_user",
      "avatar": "https://example.com/media/avatars/top_user.jpg"
    },
    "points": 1200,
    "completed_challenges": 12
  },
  {
    "rank": 2,
    "user": {
      "id": 1,
      "username": "your_username",
      "avatar": "https://example.com/media/avatars/profile.jpg"
    },
    "points": 500,
    "completed_challenges": 5
  },
  // More users...
]
```

### Get Achievements

**Endpoint**: `GET /progress/achievements/`

**Authentication**: Required

**Response**:
```json
[
  {
    "id": 1,
    "name": "First Challenge",
    "description": "Completed your first challenge",
    "icon": "trophy",
    "earned_at": "2023-06-16T14:20:30Z"
  },
  {
    "id": 2,
    "name": "Python Master",
    "description": "Completed all Python challenges",
    "icon": "python",
    "earned_at": null
  },
  // More achievements...
]
```

## Error Responses

The API returns standard HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource doesn't exist
- `500 Internal Server Error`: Something went wrong on the server

Error responses include a message explaining what went wrong:

```json
{
  "detail": "Authentication credentials were not provided."
}
```

or

```json
{
  "username": ["This field is required."],
  "password": ["This field is required."]
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you'll receive a `429 Too Many Requests` response with a `Retry-After` header indicating when you can try again. 