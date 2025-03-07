#!/bin/bash

# Vercel deployment script

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "Please log in to Vercel:"
    vercel login
fi

# Prompt for backend URL
read -p "Enter your backend API URL (e.g., https://your-backend-url.com/api): " BACKEND_URL

# Update .env.production file
echo "# Production API URL" > .env.production
echo "VITE_API_URL=$BACKEND_URL" >> .env.production
echo "Updated .env.production with API URL: $BACKEND_URL"

# Update vercel.json
cat > vercel.json << EOF
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "$BACKEND_URL/:path*"
    }
  ]
}
EOF
echo "Updated vercel.json with API URL: $BACKEND_URL"

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete! Your app should be live on Vercel."
echo "If you encounter any issues, please refer to VERCEL_DEPLOYMENT.md for troubleshooting." 