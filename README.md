# Import & Export Application

A full-stack web application for importing, editing, and exporting data with database persistence.

## ✨ Features

- 📁 Multi-format file support (CSV, JSON, Excel)
- ✏️ Inline data editing
- 🗑️ Row deletion functionality
- 💾 Save and update data in MongoDB database
- 📊 Real-time data preview
- 🎨 Modern animated UI with glassmorphism effects
- 📱 Fully responsive design
- ⚡ Fast development with React 18 and Vite

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **PapaParse** - CSV parsing
- **XLSX** - Excel file handling

### Backend
- **Node.js 18** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

## 🚀 Quick Start

### Frontend Only
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on **http://localhost:5173**

### Full Stack (Frontend + Backend)

See **COMPLETE_SETUP.md** for detailed instructions.

**Quick Steps:**
```bash
# Terminal 1 - Frontend
npm install && npm run dev

# Terminal 2 - Backend
cd "backend + mongodb"
npm install && npm start
```

## 📁 Project Structure

```
new-project/
├── src/                      # Frontend React code
│   ├── App.jsx              # Main component
│   ├── main.jsx
│   └── index.css
├── backend + mongodb/        # Backend API
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env.example
├── package.json              # Frontend dependencies
├── README.md                 # This file
├── COMPLETE_SETUP.md        # Full stack setup guide
└── QUICK_START.md           # Quick reference
```

## 🎯 How to Use

1. **Import Data**: Upload CSV, JSON, or Excel files
2. **View & Edit**: Edit cells inline, delete rows
3. **Save to Database**: Click "Save to Database" button
4. **Export**: Download in CSV, JSON, or Excel format
5. **Update**: After saving, update button appears

## 📚 Documentation

- **COMPLETE_SETUP.md** - Complete setup guide with troubleshooting
- **DEPLOYMENT_GUIDE.md** - Deploy to EC2 or cloud servers (READ THIS FOR PRODUCTION!)
- **EC2_QUICK_DEPLOY.md** - Quick EC2 deployment guide
- **QUICK_START.md** - Quick reference guide
- **SETUP_AND_REQUIREMENTS.md** - Detailed requirements
- **backend + mongodb/README.md** - Backend API documentation

## 🔧 Development

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

### Backend
```bash
cd "backend + mongodb"
npm start        # Production server
npm run dev      # Development with nodemon
```

## 🐳 Docker

### Frontend
```bash
docker build -t import-export-app .
docker run -p 4173:4173 import-export-app
```

### Backend
```bash
cd "backend + mongodb"
docker build -t backend-app .
docker run -p 3000:3000 backend-app
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/save` | Save data to database |
| GET | `/api/data` | Get all saved data |
| GET | `/api/data/:id` | Get specific data |
| PUT | `/api/data/:id` | Update data |
| DELETE | `/api/data/:id` | Delete data |

## ⚙️ Requirements

- Node.js 18.x
- MongoDB (local or Atlas)
- npm

## 📝 License

MIT

