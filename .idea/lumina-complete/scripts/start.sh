#!/bin/bash

# Lumina Social Platform - Quick Start Script

echo "🚀 Starting Lumina Social Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed${NC}"
    echo "Running npm install..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env
fi

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo -e "${YELLOW}⚠️  MongoDB is not running${NC}"
        echo "Please start MongoDB in another terminal with: mongod"
        echo ""
        read -p "Press enter when MongoDB is ready..."
    fi
fi

# Start the server
echo -e "${BLUE}Starting backend server...${NC}"
echo ""
npm start
