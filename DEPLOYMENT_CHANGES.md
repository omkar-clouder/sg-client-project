# Deployment Changes Summary

This document explains **exactly what changes are needed** to deploy your application from localhost to EC2 or any cloud server.

---

## 🔧 Required Changes

### 1. Frontend Code Change ✅ (Already Done)

**File: `src/App.jsx`**

**Before:**
```javascript
const API_URL = 'http://localhost:3000/api'
```

**After:**
```javascript
// Use environment variable or default to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

**What this does:**
- Allows API URL to be configured via environment variable
- Works in both development and production
- Defaults to localhost for local development

---

### 2. Create Frontend `.env` File

**Location:** Project root (same folder as `package.json`)

**Content:**
```env
# For localhost development (don't change this)
VITE_API_URL=http://localhost:3000/api
```

**For Production (EC2):**
```env
# Replace with your EC2 IP
VITE_API_URL=http://your-ec2-ip:3000/api

# OR with domain
VITE_API_URL=http://yourdomain.com/api

# OR with HTTPS
VITE_API_URL=https://yourdomain.com/api
```

---

### 3. Backend Configuration

**File: `backend + mongodb/server.js`**

✅ **No changes needed!** The backend already supports environment variables.

**File: `backend + mongodb/.env`**

**For Local Development:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/importexport
```

**For Production (EC2 with local MongoDB):**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/importexport
```

**For Production (MongoDB Atlas - Recommended):**
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/importexport
```

---

## 📝 Deployment Steps Summary

### On Local Machine (Development)
```bash
# Start backend
cd "backend + mongodb"
npm install
npm start

# Start frontend (in another terminal)
npm install
npm run dev
```

### On EC2 Server (Production)
```bash
# 1. Install dependencies
npm install
cd "backend + mongodb"
npm install
cd ..

# 2. Create .env files
echo "VITE_API_URL=http://your-ec2-ip:3000/api" > .env
echo "PORT=3000
MONGODB_URI=mongodb://localhost:27017/importexport" > backend\ +\ mongodb/.env

# 3. Build frontend
npm run build

# 4. Start with PM2
cd "backend + mongodb"
pm2 start server.js --name backend

cd ..
pm2 serve dist 4173 --name frontend --spa

# 5. Save PM2 config
pm2 save
```

---

## 🌐 Domain & HTTPS Setup (Optional)

### With Nginx Reverse Proxy

**1. Install Nginx:**
```bash
sudo apt install nginx -y
```

**2. Configure:**
```bash
sudo nano /etc/nginx/sites-available/default
```

**3. Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-ec2-ip;

    location / {
        proxy_pass http://localhost:4173;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

**4. Reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**5. Update frontend .env:**
```env
VITE_API_URL=http://your-ec2-ip/api
```

**6. Rebuild:**
```bash
npm run build
pm2 restart frontend
```

### SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Files Summary

### Files to Change for Production:

1. **✅ `src/App.jsx`** - Already updated to use environment variable
2. **✅ `.env`** - Create this file in project root
3. **✅ `backend + mongodb/.env`** - Create this file

### Files Not to Change:

- `backend + mongodb/server.js` - Already configured correctly
- `package.json` files - No changes needed
- All other configuration files

---

## 🎯 Environment Variables Explained

### VITE_API_URL

**Purpose:** Tells frontend where to send API requests

**Development:**
```env
VITE_API_URL=http://localhost:3000/api
```

**Production (Direct IP):**
```env
VITE_API_URL=http://54.123.45.67:3000/api
```

**Production (With Domain):**
```env
VITE_API_URL=https://app.yourdomain.com/api
```

**Note:** Must start with `VITE_` for Vite to expose it to the app

### Backend Environment Variables

**MONGODB_URI**

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/importexport
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/importexport
```

**PORT**
```env
PORT=3000
```

---

## 🚀 Quick Deployment Checklist

- [ ] Update `src/App.jsx` (already done ✅)
- [ ] Create frontend `.env` file
- [ ] Create backend `.env` file
- [ ] Install dependencies on EC2
- [ ] Build frontend (`npm run build`)
- [ ] Start backend with PM2
- [ ] Start frontend with PM2
- [ ] Configure Security Group (ports 3000, 4173)
- [ ] Test backend: http://ec2-ip:3000/api/health
- [ ] Test frontend: http://ec2-ip:4173

---

## 📖 Next Steps

1. **Read:** `EC2_QUICK_DEPLOY.md` - Step by step EC2 deployment
2. **Read:** `DEPLOYMENT_GUIDE.md` - Complete deployment guide
3. **Follow:** The deployment steps in either guide

---

## 💡 Key Points

1. **Only 1 code change needed** - Frontend API URL
2. **Environment variables** control where app connects
3. **PM2** keeps your app running after disconnect
4. **Nginx** (optional) provides reverse proxy for clean URLs
5. **MongoDB Atlas** (recommended) for managed database

---

## 🆘 Troubleshooting

**Frontend can't connect to backend:**
- Check `.env` file has correct API URL
- Check Security Group allows port 3000
- Check backend is running: `pm2 logs backend`

**Environment variables not working:**
- Must start with `VITE_` for frontend
- Must rebuild after changing `.env`
- Use `pm2 restart frontend` after rebuild

---

## 📞 Need Help?

- Check `EC2_QUICK_DEPLOY.md` for step-by-step instructions
- Check `DEPLOYMENT_GUIDE.md` for comprehensive guide
- Check PM2 logs: `pm2 logs`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

**Your deployment is now ready!** 🎉

