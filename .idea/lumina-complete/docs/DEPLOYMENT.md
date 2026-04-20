# 🚀 Lumina Deployment Guide

This guide covers multiple deployment options for the Lumina Social Platform.

## Table of Contents
- [Quick Local Deployment](#quick-local-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Checklist](#production-checklist)

---

## Quick Local Deployment

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update .env with your connection string)
```

### Step 3: Configure Environment
```bash
cp .env.example .env
# Edit .env and update:
# - JWT_SECRET (use a strong random key)
# - MONGODB_URI (if using Atlas)
```

### Step 4: Seed Database (Optional)
```bash
npm run seed
```

### Step 5: Start the Server
```bash
npm start
# or for development
npm run dev
```

### Step 6: Access the Application
- **Backend API**: http://localhost:3001
- **Frontend**: Open `frontend/index.html` in browser or:
  ```bash
  npx http-server frontend -p 3000
  ```

---

## Docker Deployment

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Step 1: Build and Run with Docker Compose
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 3001
- Frontend (nginx) on port 3000

### Step 2: Check Status
```bash
docker-compose ps
docker-compose logs -f
```

### Step 3: Seed Database
```bash
docker-compose exec backend npm run seed
```

### Step 4: Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Useful Docker Commands
```bash
# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View logs
docker-compose logs backend
docker-compose logs mongodb

# Execute commands in container
docker-compose exec backend sh
docker-compose exec mongodb mongosh

# Remove all data (fresh start)
docker-compose down -v
```

---

## Cloud Deployment

### Option 1: Heroku

#### Backend Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create lumina-backend

# Add MongoDB Atlas addon or use external
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# Deploy
git push heroku main

# Seed database
heroku run npm run seed
```

#### Frontend Deployment
```bash
# Deploy to Netlify/Vercel
# 1. Update API_URL in frontend/index.html
# 2. Deploy frontend folder
# 3. Configure custom domain
```

### Option 2: DigitalOcean

#### 1. Create Droplet
- Ubuntu 22.04
- At least 1GB RAM
- Enable SSH access

#### 2. Setup Server
```bash
# SSH into server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Clone your repo
git clone your-repo-url lumina
cd lumina

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with your values

# Seed database
npm run seed

# Start with PM2
pm2 start backend/server.js --name lumina-backend
pm2 save
pm2 startup
```

#### 3. Setup Nginx Reverse Proxy
```bash
sudo apt-get install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/lumina

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://localhost:3001;
    }

    location / {
        root /var/www/lumina/frontend;
        try_files $uri $uri/ /index.html;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/lumina /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Copy frontend files
sudo mkdir -p /var/www/lumina
sudo cp -r frontend /var/www/lumina/
```

#### 4. Setup SSL with Let's Encrypt
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: AWS (EC2 + RDS)

#### 1. Launch EC2 Instance
- Amazon Linux 2 or Ubuntu
- t2.micro or larger
- Configure security group (ports 22, 80, 443, 3001)

#### 2. Setup MongoDB Atlas
- Create free cluster at mongodb.com/atlas
- Whitelist EC2 IP
- Get connection string

#### 3. Deploy Application
```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18

# Clone and setup
git clone your-repo-url lumina
cd lumina
npm install

# Configure
cp .env.example .env
# Update with Atlas URI

# Install PM2
npm install -g pm2
pm2 start backend/server.js
pm2 startup
pm2 save
```

#### 4. Setup Load Balancer (Optional)
- Create Application Load Balancer
- Configure target groups
- Setup health checks
- Configure SSL certificate

### Option 4: Google Cloud Platform

#### Using Cloud Run
```bash
# Install gcloud CLI
# Login
gcloud auth login

# Set project
gcloud config set project your-project-id

# Build and deploy
gcloud builds submit --tag gcr.io/your-project-id/lumina-backend
gcloud run deploy lumina-backend \
  --image gcr.io/your-project-id/lumina-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "JWT_SECRET=your-secret,MONGODB_URI=your-atlas-uri"
```

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to strong random key
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Set up security headers
- [ ] Enable MongoDB authentication
- [ ] Use secure session management
- [ ] Implement input validation
- [ ] Set up WAF (Web Application Firewall)

### Database
- [ ] Use MongoDB Atlas or managed database
- [ ] Set up regular backups
- [ ] Configure replica sets
- [ ] Implement database monitoring
- [ ] Set up indexes for performance
- [ ] Plan capacity and scaling

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Implement caching (Redis)
- [ ] Optimize images and media
- [ ] Enable HTTP/2
- [ ] Set up load balancing
- [ ] Configure connection pooling

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston)
- [ ] Implement health checks
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Track performance metrics
- [ ] Set up analytics

### Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure automated testing
- [ ] Implement blue-green deployment
- [ ] Set up staging environment
- [ ] Configure automatic backups
- [ ] Document deployment process
- [ ] Set up rollback procedures

### Legal & Compliance
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Implement GDPR compliance
- [ ] Set up user data export
- [ ] Configure data retention
- [ ] Add cookie consent

### Maintenance
- [ ] Set up automated updates
- [ ] Schedule regular security audits
- [ ] Plan database maintenance
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Document troubleshooting

---

## Environment Variables Reference

### Required
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lumina
JWT_SECRET=your-super-secret-random-key-here
```

### Optional
```env
FRONTEND_URL=https://your-domain.com
MAX_FILE_SIZE=52428800
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=lumina-uploads
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3001
# Kill it
kill -9 <PID>
```

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh $MONGODB_URI
```

### PM2 Issues
```bash
# Restart app
pm2 restart lumina-backend

# View logs
pm2 logs lumina-backend

# Monitor
pm2 monit
```

### Nginx Issues
```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

---

## Support

For deployment help:
- **GitHub Issues**: [Report Issues](https://github.com/your-repo/issues)
- **Documentation**: `/docs` folder
- **Email**: support@lumina.dev

---

**Good luck with your deployment! 🚀**
