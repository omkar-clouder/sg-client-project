# Deployment Guide - EC2 or Cloud Server

This guide will help you deploy the Import/Export application to EC2 or any cloud server.

---

## 🔧 Changes Required for Production

### 1. Frontend Changes

**Update `src/App.jsx` to use environment variable for API URL:**

```javascript
// Instead of hardcoded localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

**Create `.env` file in project root:**
```env
VITE_API_URL=http://your-ec2-ip:3000/api
```

**Or for domain:**
```env
VITE_API_URL=https://yourdomain.com/api
```

### 2. Backend Changes

**Update `backend + mongodb/server.js` to accept environment variables:**

The backend already supports this! Just update `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/importexport
# OR use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/importexport
```

**Add CORS configuration for production (already in server.js):**
- CORS is already configured to allow all origins
- For production, you might want to restrict it to your domain

---

## 🚀 Deployment to EC2 (Step by Step)

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose:
   - **AMI**: Ubuntu 22.04 LTS (or Amazon Linux)
   - **Instance Type**: t2.micro (free tier) or t3.small
   - **Key Pair**: Create or select existing key pair (.pem file)
   - **Security Group**: Allow ports 22 (SSH), 80, 443, 3000, 5173
4. Launch instance

### Step 2: Connect to EC2 Instance

```bash
# Windows PowerShell
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# After connecting, update system
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Required Software

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install MongoDB (Optional - or use MongoDB Atlas)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (Process Manager)
sudo npm install -g pm2
sudo npm install -g serve
```

### Step 4: Upload Code to EC2

**Option A: Using Git**
```bash
# On your local machine
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main

# On EC2
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

**Option B: Using SCP (Windows PowerShell)**
```bash
# From your local machine (in project directory)
# Compress the project
# Then upload using file transfer tool or SCP
```

**Option C: Using Visual Studio Code Remote SSH**
- Install "Remote - SSH" extension in VS Code
- Connect to EC2
- Upload files directly

### Step 5: Setup Environment Variables

```bash
# Navigate to project directory
cd ~/your-repo
# or wherever you uploaded the project

# Frontend .env
nano .env
# Add: VITE_API_URL=http://your-ec2-ip:3000/api
# Save: Ctrl+X, Y, Enter

# Backend .env
cd "backend + mongodb"
cp .env.example .env
nano .env
# Add:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/importexport
# Or MongoDB Atlas connection string
# Save: Ctrl+X, Y, Enter
```

### Step 6: Build and Deploy Backend

```bash
cd ~/your-repo/backend\ +\ mongodb

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name backend

# Make it start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs backend
```

### Step 7: Build and Deploy Frontend

```bash
cd ~/your-repo

# Install dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder

# Serve the built files with PM2
pm2 serve dist 4173 --name frontend --spa

# Or use serve
serve -s dist -l 4173

# Make it start on boot
pm2 save

# Check status
pm2 status
pm2 logs frontend
```

### Step 8: Configure Security Group

In AWS Console → EC2 → Security Groups:
- Allow **port 3000** (backend)
- Allow **port 4173** (frontend) or use Nginx as reverse proxy

---

## 🌐 Using Nginx as Reverse Proxy (Optional but Recommended)

### Step 1: Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

**Replace with this configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com or your-ec2-ip;

    # Frontend
    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Save and reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Now access:**
- Frontend: http://your-ec2-ip
- Backend: http://your-ec2-ip/api

---

## 🔒 Using Domain Name (Optional)

### Step 1: Point Domain to EC2

1. Get your EC2 Elastic IP from AWS Console
2. Add A record in your domain DNS settings
3. Point to EC2 Elastic IP

### Step 2: Update Frontend .env

```env
VITE_API_URL=https://yourdomain.com/api
```

### Step 3: Rebuild Frontend

```bash
cd ~/your-repo
npm run build
pm2 restart frontend
```

### Step 4: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

Update Nginx config to use HTTPS.

---

## 📦 Docker Deployment (Alternative)

### Create docker-compose.yml in project root:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: always

  backend:
    build: ./backend + mongodb
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/importexport
    restart: always

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  mongo-data:
```

### Deploy:

```bash
# On EC2
sudo docker-compose up -d

# Check logs
sudo docker-compose logs -f
```

---

## 🔄 Update Existing Deployment

When you make changes and want to update:

```bash
# On EC2, navigate to project
cd ~/your-repo

# Pull latest changes (if using Git)
git pull

# Rebuild frontend
npm install
npm run build

# Restart services
pm2 restart frontend
pm2 restart backend
```

---

## 📝 Production Checklist

- [ ] Security Group allows ports 3000 and 4173 (or 80/443)
- [ ] MongoDB running (local or Atlas)
- [ ] Environment variables configured
- [ ] Backend running with PM2
- [ ] Frontend built and running
- [ ] Test API: `curl http://your-ec2-ip:3000/api/health`
- [ ] Test frontend: Open http://your-ec2-ip:4173
- [ ] PM2 processes auto-start on boot
- [ ] Firewall configured (if applicable)

---

## 🛠️ Troubleshooting

### Backend not accessible
```bash
# Check if backend is running
pm2 status
pm2 logs backend

# Check MongoDB connection
sudo systemctl status mongod
```

### Frontend not loading
```bash
# Rebuild frontend
cd ~/your-repo
npm run build
pm2 restart frontend

# Check logs
pm2 logs frontend
```

### Port issues
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :4173

# Kill process if needed
sudo kill -9 <PID>
```

### CORS errors
- Backend CORS already configured in server.js
- If issues, check Security Group allows your origin

---

## 💰 Cost Estimation (EC2)

**Free Tier (12 months):**
- t2.micro instance: FREE
- 750 hours/month
- MongoDB Atlas: FREE (512MB shared)

**After Free Tier:**
- t2.micro: ~$8/month
- t3.small: ~$15/month
- + Data transfer costs

---

## 🚀 Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd "backend + mongodb"
npm install

# Build frontend
echo "🔨 Building frontend..."
cd ..
npm run build

# Restart services
echo "♻️ Restarting services..."
pm2 restart backend
pm2 restart frontend

echo "✅ Deployment complete!"
pm2 status
```

Make executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify Security Groups allow required ports
4. Check environment variables are set correctly

**Your application is now deployed and ready to use!** 🎉

