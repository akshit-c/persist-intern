# Deployment Guide for Persist Intern

This guide provides detailed instructions for deploying the Persist Intern application to production environments.

## Current Deployment URLs

- **Frontend**: [https://frontend-qi5nip8ag-akshitchaudhary01-gmailcoms-projects.vercel.app](https://frontend-qi5nip8ag-akshitchaudhary01-gmailcoms-projects.vercel.app)
- **Backend API**: [https://persist-intern-api.onrender.com/api](https://persist-intern-api.onrender.com/api)

## Backend Deployment (Render)

### Prerequisites
- A [Render](https://render.com) account
- Your project code in a Git repository (GitHub, GitLab, etc.)

### Step 1: Set Up a PostgreSQL Database

1. Log in to your Render dashboard
2. Click on "New +" and select "PostgreSQL"
3. Configure your database:
   - **Name**: persist-intern-db
   - **Database**: persist_intern
   - **User**: persist_intern_user
   - **Region**: Choose the region closest to your users
   - **Plan**: Free (or choose a paid plan if needed)
4. Click "Create Database"
5. Once created, note the "Internal Database URL" for the next step

### Step 2: Deploy the Django Backend

1. In your Render dashboard, click on "New +" and select "Web Service"
2. Connect your GitHub/GitLab repository
3. Configure the web service:
   - **Name**: persist-intern-api
   - **Root Directory**: backend/django_app
   - **Environment**: Python
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn createathon.wsgi:application`
   - **Plan**: Free (or choose a paid plan if needed)
4. Add environment variables:
   - `PYTHON_VERSION`: 3.9.18
   - `SECRET_KEY`: (generate a random string)
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: .onrender.com
   - `DATABASE_URL`: (paste the Internal Database URL from Step 1)
5. Click "Create Web Service"

### Step 3: Verify Backend Deployment

1. Wait for the deployment to complete (this may take a few minutes)
2. Visit your backend URL (e.g., `https://persist-intern-api.onrender.com/api/`)
3. You should see the Django REST framework API root
4. Test a few endpoints to ensure they're working correctly

## Frontend Deployment (Vercel)

### Prerequisites
- A [Vercel](https://vercel.com) account
- Your project code in a Git repository (GitHub, GitLab, etc.)

### Step 1: Configure Environment Variables

1. Create or update the `.env.production` file in your frontend directory:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url` with your actual Render backend URL

2. Create or update the `vercel.json` file in your frontend directory:
   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-url.onrender.com/api/:path*"
       }
     ]
   }
   ```
   Replace `your-backend-url` with your actual Render backend URL

### Step 2: Deploy to Vercel

#### Option 1: Using the Vercel Dashboard

1. Log in to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub/GitLab repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Add environment variables:
   - `VITE_API_URL`: Your backend API URL
6. Click "Deploy"

#### Option 2: Using the Deployment Script

1. Make sure you have the Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Run the deployment script:
   ```bash
   ./deploy-vercel.sh
   ```

### Step 3: Verify Frontend Deployment

1. Wait for the deployment to complete
2. Visit your Vercel deployment URL
3. Test the application functionality:
   - User registration and login
   - Viewing challenges
   - Submitting solutions
   - Checking leaderboards

## Custom Domain Setup (Optional)

### Vercel Custom Domain

1. Go to your project in the Vercel dashboard
2. Click on "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

### Render Custom Domain

1. Go to your web service in the Render dashboard
2. Click on "Settings" and then "Custom Domain"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check that your backend's CORS settings include your Vercel domain:
   ```python
   # In createathon/settings.py
   CORS_ALLOWED_ORIGINS = [
       "https://your-vercel-domain.vercel.app",
       "https://your-custom-domain.com",
       "http://localhost:5173",
   ]
   ```

2. Ensure all API requests use HTTPS if your backend uses HTTPS

### Database Connection Issues

If the backend can't connect to the database:

1. Verify the DATABASE_URL environment variable is set correctly
2. Check the database logs in the Render dashboard
3. Ensure the database is running and accessible

### Build Errors

If the frontend build fails:

1. Check the build logs in the Vercel dashboard
2. Ensure all TypeScript errors are fixed
3. Verify that all dependencies are installed correctly

## Maintenance

After deployment:

1. Set up monitoring for both frontend and backend
2. Configure automated backups for your database
3. Implement a CI/CD pipeline for future updates
4. Regularly update dependencies to address security vulnerabilities 