# EC2 Quick Deploy - Step by Step

## 📋 Pre-Deployment Checklist

- [ ] EC2 instance running (Ubuntu 22.04 recommended)
- [ ] Security Group allows ports: 22, 3000, 4173, 80, 443
- [ ] Key pair (.pem file) downloaded
- [ ] MongoDB ready (local or MongoDB Atlas)

---

## 🚀 Deployment Steps

### Step 1: Connect to EC2

```bash
# On Windows (PowerShell)
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# On Mac/Linux
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2 serve

# Install MongoDB (Optional - if not using Atlas)
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installations
node --version
npm --version
pm2 --version
```

### Step 3: Upload Your Code

**Option A: Using Git (Recommended)**

```bash
# On your local machine
cd c:\Users\omson\new-project
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/yourusername/import-export-app.git
git push -u origin main

# On EC2
git clone https://github.com/yourusername/import-export-app.git
cd import-export-app
```

**Option B: Using SCP**

```bash
# From local machine (PowerShell)
scp -i "your-key.pem" -r C:\Users\omson\new-project ubuntu@your-ec2-ip:~/

# On EC2
cd new-project
```

### Step 4: Configure Environment Variables

**Backend Configuration:**

```bash
cd "backend + mongodb"

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/importexport
EOF

# OR if using MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/importexport
```

**Frontend Configuration:**

```bash
cd ~/new-project  # or import-export-app

# Create .env file
cat > .env << EOF
VITE_API_URL=http://your-ec2-ip:3000/api
EOF

# Replace your-ec2-ip with actual EC2 IP
```

### Step 5: Deploy Backend

```bash
cd "backend + mongodb"

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name backend

# Make it auto-start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs backend
```

### Step 6: Deploy Frontend

```bash
cd ~/new-project  # or import-export-app

# Install dependencies
npm install

# Build for production
npm run build

# Serve with PM2
pm2 serve dist 4173 --name frontend --spa
pm2 save

# Check status
pm2 status
pm2 logs frontend
```

### Step 7: Test Your Deployment

```bash
# Test Backend
curl http://localhost:3000/api/health

# Should return: {"status":"OK","message":"Backend is running"}

# Check PM2 processes
pm2 status

# View all logs
pm2 logs
```

**Open in Browser:**
- Frontend: http://your-ec2-ip:4173
- Backend API: http://your-ec2-ip:3000/api/health

---

## 🌐 Optional: Setup Nginx (Recommended)

### Install and Configure Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Configure
sudo nano /etc/nginx/sites-available/default
```

**Replace with this configuration:**

```nginx
server {
    listen 80;
    server_name your-ec2-ip-or-domain;

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

**Now access at:**
- http://your-ec2-ip (port 80, no need to specify port)

### Update Frontend Configuration

```bash
# Update .env
nano .env

# Change to:
VITE_API_URL=http://your-ec2-ip/api
# OR if using domain:
VITE_API_URL=http://yourdomain.com/api

# Rebuild
npm run build

# Restart
pm2 restart frontend
```

---

## 🔒 SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

After SSL, update `.env`:
```env
VITE_API_URL=https://yourdomain.com/api
```

---

## 🔄 Updating Your Deployment

When you make changes:

```bash
# Pull latest code
git pull

# Rebuild frontend
npm install
npm run build

# Restart services
pm2 restart backend
pm2 restart frontend
```

**Or use the deployment script:**

```bash
bash deploy-ec2.sh
```

---

## 📊 Quick Commands Reference

```bash
# View all services
pm2 status

# View logs
pm2 logs
pm2 logs backend
pm2 logs frontend

# Restart services
pm2 restart backend
pm2 restart frontend

# Stop services
pm2 stop backend
pm2 stop frontend

# Delete services
pm2 delete backend
pm2 delete frontend

# Monitor resources
pm2 monit

# Save current process list
pm2 save
```

---

## ✅ Verification Checklist

- [ ] Backend running: `pm2 logs backend` shows no errors
- [ ] Frontend running: `pm2 logs frontend` shows no errors
- [ ] Backend API accessible: http://your-ec2-ip:3000/api/health
- [ ] Frontend accessible: http://your-ec2-ip:4173
- [ ] Can upload files in frontend
- [ ] Can save data to database
- [ ] Can export data
- [ ] PM2 processes auto-start on reboot
- [ ] MongoDB running (if using local)

---

## 🐛 Troubleshooting

### Backend not accessible
```bash
# Check if running
pm2 status backend

# Check logs
pm2 logs backend

# Check MongoDB
sudo systemctl status mongod
```

### Frontend not loading
```bash
# Rebuild
npm run build

# Restart
pm2 restart frontend

# Check logs
pm2 logs frontend
```

### Port issues
```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :4173

# Kill process
sudo kill -9 <PID>
```

### CORS errors
- Check Security Group allows HTTP/HTTPS
- Verify API_URL in frontend .env is correct

---

## 🎉 Success!

Your application is now deployed and running on EC2!

- **Frontend**: http://your-ec2-ip:4173
- **Backend**: http://your-ec2-ip:3000
- **API Docs**: http://your-ec2-ip:3000/api/health

---

## 📚 Additional Resources

- **DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **README.md** - Project documentation
- **backend + mongodb/README.md** - Backend API docs

