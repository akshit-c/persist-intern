# Deploying the Django Backend

This guide provides instructions for deploying the Django backend to a production environment.

## Deployment Options

There are several options for deploying a Django application:

1. **Traditional hosting** (DigitalOcean, AWS EC2, etc.)
2. **Platform as a Service** (Heroku, PythonAnywhere, etc.)
3. **Containerized deployment** (Docker + Kubernetes)

This guide will focus on deploying to a traditional hosting environment, but the principles apply to other methods as well.

## Prerequisites

- A server with Python 3.9+ installed
- A domain name (optional, but recommended)
- Basic knowledge of Linux server administration

## Deployment Steps

### 1. Update CORS Settings

Before deploying, update the CORS settings in `createathon/settings.py` to allow requests only from your Vercel frontend domain:

```python
# CORS settings
CORS_ALLOW_ALL_ORIGINS = False  # Change from True to False
CORS_ALLOWED_ORIGINS = [
    "https://your-vercel-app.vercel.app",  # Your Vercel domain
    "http://localhost:5173",  # For local development
]
CORS_ALLOW_CREDENTIALS = True
# ... rest of CORS settings ...
```

### 2. Set Up Environment Variables

Create a `.env` file on your server with the following variables:

```
DEBUG=False
SECRET_KEY=your_secure_secret_key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgres://user:password@localhost:5432/dbname  # If using PostgreSQL
```

### 3. Set Up a Production Database

For production, it's recommended to use PostgreSQL instead of SQLite:

1. Install PostgreSQL:
   ```
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib
   ```

2. Create a database and user:
   ```
   sudo -u postgres psql
   CREATE DATABASE createathon;
   CREATE USER createathon_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE createathon TO createathon_user;
   \q
   ```

3. Update `settings.py` to use the PostgreSQL database:
   ```python
   import os
   import dj_database_url
   from pathlib import Path
   from dotenv import load_dotenv

   load_dotenv()

   # ...

   DATABASES = {
       'default': dj_database_url.config(
           default=os.environ.get('DATABASE_URL'),
           conn_max_age=600
       )
   }
   ```

### 4. Set Up Gunicorn and Nginx

1. Install Gunicorn:
   ```
   pip install gunicorn
   ```

2. Create a systemd service file for Gunicorn:
   ```
   sudo nano /etc/systemd/system/gunicorn.service
   ```

   Add the following content:
   ```
   [Unit]
   Description=gunicorn daemon
   After=network.target

   [Service]
   User=your_user
   Group=www-data
   WorkingDirectory=/path/to/backend/django_app
   ExecStart=/path/to/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/path/to/backend/django_app/createathon.sock createathon.wsgi:application

   [Install]
   WantedBy=multi-user.target
   ```

3. Install and configure Nginx:
   ```
   sudo apt-get install nginx
   ```

   Create a Nginx configuration file:
   ```
   sudo nano /etc/nginx/sites-available/createathon
   ```

   Add the following content:
   ```
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location = /favicon.ico { access_log off; log_not_found off; }
       location /static/ {
           root /path/to/backend/django_app;
       }

       location /media/ {
           root /path/to/backend/django_app;
       }

       location / {
           include proxy_params;
           proxy_pass http://unix:/path/to/backend/django_app/createathon.sock;
       }
   }
   ```

   Enable the site:
   ```
   sudo ln -s /etc/nginx/sites-available/createathon /etc/nginx/sites-enabled
   ```

4. Start the services:
   ```
   sudo systemctl start gunicorn
   sudo systemctl enable gunicorn
   sudo systemctl restart nginx
   ```

### 5. Set Up HTTPS with Let's Encrypt

1. Install Certbot:
   ```
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Obtain and install a certificate:
   ```
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. Set up auto-renewal:
   ```
   sudo systemctl status certbot.timer
   ```

## Alternative: Deploying to PythonAnywhere

PythonAnywhere is a simpler option for hosting Django applications:

1. Sign up for a PythonAnywhere account
2. Upload your code or clone from Git
3. Set up a virtual environment and install dependencies
4. Configure a web app with the Django template
5. Update the WSGI configuration file
6. Set up environment variables
7. Configure your domain

For detailed instructions, refer to the [PythonAnywhere documentation](https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/).

## Connecting Frontend to Backend

After deploying your backend, update the frontend's `.env.production` file with your backend URL:

```
VITE_API_URL=https://your-domain.com/api
```

Then deploy the frontend to Vercel as described in the frontend deployment guide. 