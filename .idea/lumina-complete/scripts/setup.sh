#!/bin/bash

# Lumina Social Platform - Setup Script
# This script sets up the entire application from scratch

echo "🌟 Lumina Social Platform - Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"

# Check if MongoDB is installed
echo -e "${BLUE}Checking MongoDB installation...${NC}"
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not installed locally${NC}"
    echo "You can either:"
    echo "  1. Install MongoDB locally: https://www.mongodb.com/try/download/community"
    echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo -e "${GREEN}✅ MongoDB found: ${MONGO_VERSION}${NC}"
fi

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p uploads
mkdir -p logs
echo -e "${GREEN}✅ Directories created${NC}"

echo ""
echo -e "${BLUE}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and update:${NC}"
    echo "   - JWT_SECRET (use a strong random key)"
    echo "   - MONGODB_URI (if using MongoDB Atlas)"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

echo ""
echo -e "${BLUE}Checking MongoDB connection...${NC}"
# Try to start MongoDB if it's installed locally
if command -v mongod &> /dev/null; then
    # Check if MongoDB is already running
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✅ MongoDB is already running${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
        echo "Please start MongoDB with: mongod"
    fi
fi

echo ""
read -p "Do you want to seed the database with demo data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Seeding database...${NC}"
    npm run seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
    else
        echo -e "${RED}❌ Failed to seed database${NC}"
        echo "Make sure MongoDB is running and connection details are correct"
    fi
fi

echo ""
echo -e "${GREEN}=========================================="
echo "🎉 Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend server:"
echo -e "   ${BLUE}npm start${NC} (or ${BLUE}npm run dev${NC} for auto-reload)"
echo ""
echo "2. Open the frontend:"
echo -e "   ${BLUE}open frontend/index.html${NC} in your browser"
echo -e "   Or use a local server like: ${BLUE}npx http-server frontend${NC}"
echo ""
echo "3. Demo Login Credentials:"
echo -e "   Email: ${BLUE}sarah@lumina.dev${NC}"
echo -e "   Password: ${BLUE}demo123${NC}"
echo ""
echo "4. Backend API running at:"
echo -e "   ${BLUE}http://localhost:3001${NC}"
echo ""
echo "5. Documentation:"
echo "   Check docs/ folder for detailed guides"
echo ""
echo -e "${YELLOW}⭐ Star us on GitHub if you like Lumina!${NC}"
echo ""
