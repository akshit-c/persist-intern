# Deployment Guide for Persist Intern

This guide provides instructions for deploying both the frontend and backend components of the Persist Intern application.

## Overview

The application consists of:
- **Frontend**: React application built with Vite
- **Backend**: Django REST API

The deployment strategy is:
1. Deploy the Django backend to a hosting service
2. Deploy the React frontend to Vercel
3. Connect the frontend to the backend

## Backend Deployment

### Option 1: Traditional Hosting (DigitalOcean, AWS EC2, etc.)

Follow the detailed instructions in [backend/django_app/DEPLOYMENT.md](backend/django_app/DEPLOYMENT.md).

Key steps:
1. Set up a server with Python 3.9+
2. Configure CORS settings to allow requests from your Vercel domain
3. Set up environment variables
4. Set up a production database (PostgreSQL recommended)
5. Configure Gunicorn and Nginx
6. Set up HTTPS with Let's Encrypt

### Option 2: Platform as a Service (PythonAnywhere, Heroku, etc.)

PythonAnywhere is a simpler option for hosting Django applications:

1. Sign up for a PythonAnywhere account
2. Upload your code or clone from Git
3. Set up a virtual environment and install dependencies
4. Configure a web app with the Django template
5. Update the WSGI configuration file
6. Set up environment variables
7. Configure your domain

For detailed instructions, refer to the [PythonAnywhere documentation](https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/).

## Frontend Deployment to Vercel

Follow the detailed instructions in [frontend/VERCEL_DEPLOYMENT.md](frontend/VERCEL_DEPLOYMENT.md).

Key steps:

### 1. Update Environment Variables

Before deploying, update the backend API URL in the `.env.production` file:

```
VITE_API_URL=https://your-backend-url.com/api
```

Replace `https://your-backend-url.com/api` with your actual deployed backend URL.

### 2. Deploy using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "New Project"
4. Import your repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add the environment variable:
   - Name: `VITE_API_URL`
   - Value: Your backend API URL
7. Click "Deploy"

### 3. Automated Deployment Script

Alternatively, you can use the provided deployment script:

```bash
cd frontend
./deploy-vercel.sh
```

This script will:
1. Check if Vercel CLI is installed
2. Prompt for your backend API URL
3. Update the necessary configuration files
4. Deploy to Vercel

## Connecting Frontend to Backend

After deploying both components:

1. Make sure your backend allows CORS requests from your Vercel domain
2. Ensure your frontend is configured with the correct backend URL
3. Test the connection by logging in and using the application

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check that your backend's CORS settings include your Vercel domain
2. Ensure all API requests use HTTPS if your backend uses HTTPS
3. Verify that credentials are handled correctly if using authentication

### API Connection Issues

If the frontend can't connect to the backend:

1. Verify that the backend is accessible from the internet
2. Check that the `VITE_API_URL` environment variable is set correctly
3. Ensure the API endpoints match what the frontend expects

### Authentication Issues

If users can't log in:

1. Check that the JWT token handling is working correctly
2. Verify that the backend authentication endpoints are accessible
3. Ensure cookies or local storage are being used correctly for token storage

## Maintenance

After deployment:

1. Set up monitoring for both frontend and backend
2. Configure automated backups for your database
3. Implement a CI/CD pipeline for future updates
4. Regularly update dependencies to address security vulnerabilities 