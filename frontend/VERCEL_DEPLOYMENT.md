# Deploying to Vercel

This document provides instructions for deploying the frontend application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. The [Vercel CLI](https://vercel.com/docs/cli) (optional, but recommended)
3. Your backend API deployed and accessible

## Deployment Steps

### 1. Update Environment Variables

Before deploying, make sure to update the backend API URL in the `.env.production` file:

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

### 3. Deploy using Vercel CLI

Alternatively, you can deploy using the Vercel CLI:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Navigate to the frontend directory and deploy:
   ```
   cd frontend
   vercel
   ```

4. Follow the prompts to configure your project
5. To deploy to production:
   ```
   vercel --prod
   ```

## Handling Backend API

The frontend is configured to communicate with your backend API through the environment variable `VITE_API_URL`. Make sure your backend is:

1. Deployed and accessible from the internet
2. Configured with proper CORS headers to allow requests from your Vercel domain
3. Secured with HTTPS

## Troubleshooting

- If you encounter CORS issues, make sure your backend allows requests from your Vercel domain
- If API requests fail, check that the `VITE_API_URL` is correctly set
- For other issues, refer to the [Vercel documentation](https://vercel.com/docs) 