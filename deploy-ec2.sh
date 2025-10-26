#!/bin/bash

# Deployment Script for Import/Export App on EC2
# Usage: bash deploy-ec2.sh

echo "🚀 Starting Deployment Process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "${RED}PM2 not found. Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Navigate to project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR

# Step 1: Deploy Backend
echo "${BLUE}📦 Deploying Backend...${NC}"
cd "backend + mongodb"

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Start backend with PM2
echo "Starting backend service..."
pm2 delete backend 2>/dev/null || true
pm2 start server.js --name backend
pm2 save

cd ..

# Step 2: Build and Deploy Frontend
echo "${BLUE}📦 Building Frontend...${NC}"

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build for production
echo "Building production bundle..."
npm run build

# Serve frontend
echo "Starting frontend service..."
pm2 delete frontend 2>/dev/null || true
pm2 serve dist 4173 --name frontend --spa

# Save PM2 configuration
pm2 save

# Step 3: Show Status
echo ""
echo "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Service Status:"
pm2 status
echo ""
echo "${GREEN}🎉 Your app is now running:${NC}"
echo "   Frontend: http://your-server-ip:4173"
echo "   Backend API: http://your-server-ip:3000/api"
echo ""
echo "To view logs:"
echo "   pm2 logs backend"
echo "   pm2 logs frontend"
echo ""
echo "To restart services:"
echo "   pm2 restart backend frontend"

