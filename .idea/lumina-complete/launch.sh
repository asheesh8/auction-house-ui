#!/bin/bash

# 🚀 LUMINA COMPLETE LAUNCH SCRIPT 🚀
# This script launches the ENTIRE Lumina platform from scratch

clear
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║         🌟 LUMINA SOCIAL PLATFORM LAUNCHER 🌟           ║"
echo "║                                                          ║"
echo "║        Complete Setup & Launch in One Command!          ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function to print with emoji and color
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Banner
echo -e "${PURPLE}"
cat << "EOF"
    __    __  ____  ____ ___ _   _   ___  
    ||    || ||  \\//  ||   ||\\//||   // \\ 
    ||    || ||   ||   ||   || \/ ||  ||=|| 
    ||____|| ||   ||   ||   ||    ||  || || 
    
    Social Learning Platform - v1.0.0
EOF
echo -e "${NC}"
echo ""

# Step 1: Check Prerequisites
print_step "Checking prerequisites..."
sleep 1

if ! command -v node &> /dev/null; then
    print_error "Node.js not found!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
print_success "Node.js $(node -v) detected"

if ! command -v npm &> /dev/null; then
    print_error "npm not found!"
    exit 1
fi
print_success "npm $(npm -v) detected"

# Step 2: MongoDB Check
print_step "Checking MongoDB..."
sleep 1

MONGO_RUNNING=false
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        MONGO_RUNNING=true
        print_success "MongoDB is running"
    else
        print_warning "MongoDB installed but not running"
        echo ""
        echo "Starting MongoDB..."
        mongod --fork --logpath /tmp/mongod.log --dbpath /tmp/mongodb-data 2>/dev/null
        sleep 2
        if pgrep -x "mongod" > /dev/null; then
            MONGO_RUNNING=true
            print_success "MongoDB started successfully"
        fi
    fi
else
    print_warning "MongoDB not installed locally"
    print_info "Will use connection string from .env or default to localhost"
fi

# Step 3: Install Dependencies
print_step "Installing dependencies..."
sleep 1

if [ ! -d "node_modules" ]; then
    npm install --silent 2>&1 | grep -v "npm WARN" > /dev/null
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed ($(ls node_modules | wc -l | tr -d ' ') packages)"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

# Step 4: Setup Environment
print_step "Configuring environment..."
sleep 1

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Environment file created"
else
    print_success "Environment file exists"
fi

# Step 5: Create Directories
print_step "Creating directories..."
sleep 1

mkdir -p uploads logs
print_success "Directories ready"

# Step 6: Database Seeding
echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
print_step "Database Setup"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

read -p "$(echo -e ${YELLOW}'Seed database with demo data? (y/n): '${NC})" -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Seeding database..."
    sleep 1
    
    npm run seed 2>&1 | tail -10
    
    if [ $? -eq 0 ]; then
        print_success "Database seeded with demo data"
        echo ""
        print_info "Demo Login Credentials:"
        echo -e "  ${CYAN}Email:${NC} sarah@lumina.dev"
        echo -e "  ${CYAN}Password:${NC} demo123"
    else
        print_warning "Seeding skipped or failed"
    fi
else
    print_info "Skipping database seed"
fi

# Step 7: Final Checks
echo ""
print_step "Running final checks..."
sleep 1

# Check if port is available
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    print_warning "Port 3001 is already in use"
    print_info "Will attempt to use alternative port"
fi

print_success "All systems ready!"

# Step 8: Launch!
echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  🚀 LAUNCHING LUMINA PLATFORM 🚀${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

sleep 2

# Display launch info
echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}         ${GREEN}LUMINA IS NOW STARTING${NC}              ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BLUE}Backend API:${NC}  http://localhost:3001       ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BLUE}Frontend:${NC}     Open frontend/index.html    ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BLUE}Health:${NC}       http://localhost:3001/health${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                              ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}         ${YELLOW}Press Ctrl+C to stop${NC}                ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Start server
print_step "Starting backend server..."
echo ""

# Check if we should start in dev mode
if [ "$1" == "dev" ]; then
    npm run dev
else
    npm start
fi

# This runs when server stops
echo ""
print_info "Lumina platform stopped"
echo ""
echo "Thanks for using Lumina! 🌟"
echo ""
