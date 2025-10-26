# Backend with MongoDB

Simple Express.js backend with MongoDB for the Import/Export application.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- No additional configuration needed

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `.env` file with your connection string

### 3. Configure Environment
```bash
# Create .env file from example
cp .env.example .env

# Edit .env with your settings
```

### 4. Start Server
```bash
npm start
```

Server runs on http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/save` | Save imported data |
| GET | `/api/data` | Get all saved data |
| GET | `/api/data/:id` | Get specific data by ID |
| PUT | `/api/data/:id` | Update data |
| DELETE | `/api/data/:id` | Delete data |

## Example Usage

### Save Data
```bash
curl -X POST http://localhost:3000/api/save \
  -H "Content-Type: application/json" \
  -d '{"data": [{"name":"John","age":30}], "fileName":"users.json", "fileType":"json"}'
```

### Get All Data
```bash
curl http://localhost:3000/api/data
```

### Delete Data
```bash
curl -X DELETE http://localhost:3000/api/data/ID_HERE
```

## Docker

```bash
# Build image
docker build -t backend-app .

# Run container
docker run -p 3000:3000 backend-app
```

## Requirements

- Node.js 18.x
- MongoDB (local or cloud)
- npm

## Troubleshooting

**Problem**: Cannot connect to MongoDB
- Make sure MongoDB is running (local)
- Check connection string (cloud)
- Verify MongoDB service is active

**Problem**: Port 3000 already in use
- Change PORT in .env file to another port (e.g., 3001)


