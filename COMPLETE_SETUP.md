# Complete Setup Guide - Import/Export App

This guide will help you set up and run both the frontend (React) and backend (Node.js + MongoDB) application.

---

## 📋 Prerequisites

### Required Software

1. **Node.js 18.x** (Download from https://nodejs.org/)
2. **MongoDB** (Choose one):
   - **Option A**: Local MongoDB (Download from https://www.mongodb.com/try/download/community)
   - **Option B**: MongoDB Atlas (Cloud - Free tier available at https://www.mongodb.com/cloud/atlas)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Setup Frontend

```bash
# Navigate to project root
cd c:\Users\omson\new-project

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on **http://localhost:5173**

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd "backend + mongodb"

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file (optional - defaults work for local MongoDB)
# If using MongoDB Atlas, update MONGODB_URI

# Start backend server
npm start
```

Backend runs on **http://localhost:3000**

### Step 3: Start MongoDB

**If using Local MongoDB:**
```bash
# Windows (if MongoDB installed as service)
# MongoDB starts automatically

# Verify it's running
mongosh
# If connected, type 'exit' to quit
```

**If using MongoDB Atlas:**
- No setup needed, just use your connection string in `.env`

---

## 📁 Project Structure

```
new-project/
├── src/                    # Frontend React code
│   ├── App.jsx            # Main component with backend integration
│   ├── main.jsx
│   └── index.css
├── package.json           # Frontend dependencies
├── vite.config.js
└── README.md

backend + mongodb/
├── server.js              # Complete backend with MongoDB
├── package.json          # Backend dependencies
├── .env.example          # Environment variables template
├── Dockerfile            # Docker configuration
└── README.md             # Backend documentation
```

---

## 🔧 Configuration

### Frontend Configuration

No configuration needed! Frontend connects to backend at `http://localhost:3000`

To change backend URL, edit `src/App.jsx`:
```javascript
const API_URL = 'http://localhost:3000/api'
```

### Backend Configuration

Edit `backend + mongodb/.env`:

**For Local MongoDB:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/importexport
```

**For MongoDB Atlas:**
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/importexport
```

---

## 🎯 How to Use

### 1. Start Both Servers

**Terminal 1 (Frontend):**
```bash
cd c:\Users\omson\new-project
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd "c:\Users\omson\new-project\backend + mongodb"
npm start
```

### 2. Use the Application

1. **Import Data**: Click upload area → Select CSV, JSON, or Excel file
2. **View Data**: Table appears with your data
3. **Edit Data**: Click edit button on any row
4. **Save to Database**: Click "Save to Database" button
5. **Update Data**: After saving, button changes to "Update in Database"
6. **Export Data**: Click any export button (CSV, JSON, Excel)
7. **Delete Row**: Click delete button on any row

---

## 🛠️ Troubleshooting

### Problem: Port already in use

**Frontend (5173):**
```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5173
# Kill the process ID shown
```

**Backend (3000):**
```bash
Get-NetTCPConnection -LocalPort 3000
# Kill the process or change PORT in .env
```

### Problem: Cannot connect to MongoDB

**Local MongoDB:**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Make sure MongoDB service is running
- Try: `mongosh` to test connection

**MongoDB Atlas:**
- Verify connection string in `.env`
- Make sure IP address is whitelisted
- Check username and password

### Problem: Backend not responding

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Should return: {"status":"OK","message":"Backend is running"}
```

### Problem: Frontend can't reach backend

1. Make sure backend is running on port 3000
2. Check browser console for errors
3. Verify CORS is enabled (already configured)

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |
| POST | `/api/save` | Save imported data |
| GET | `/api/data` | Get all saved data |
| GET | `/api/data/:id` | Get specific data |
| PUT | `/api/data/:id` | Update data |
| DELETE | `/api/data/:id` | Delete data |

---

## 🐳 Docker Setup (Optional)

### Backend with Docker

```bash
cd "backend + mongodb"

# Build image
docker build -t backend-app .

# Run container
docker run -p 3000:3000 backend-app
```

### Using Docker Compose (Full Stack)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend + mongodb
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/importexport

  frontend:
    build: .
    ports:
      - "4173:4173"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up
```

---

## 📝 Available Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Scripts
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-restart)
```

---

## ✅ Verification Checklist

- [ ] Node.js 18.x installed and verified (`node --version`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] Can access frontend at http://localhost:5173
- [ ] Can access backend at http://localhost:3000/api/health

---

## 🎉 You're All Set!

The application is now ready to use:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

Enjoy importing, editing, and exporting your data!

---

## 📞 Need Help?

- Check `SETUP_AND_REQUIREMENTS.md` for detailed requirements
- Check `QUICK_START.md` for quick reference
- Check backend README in `backend + mongodb/README.md`
- Check frontend README in project `README.md`

