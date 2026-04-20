# ⚡ Lumina Quick Start Guide

Get Lumina up and running in **5 minutes**!

## Prerequisites ✅

- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

## Installation 🚀

### Option 1: Automated Setup (Recommended)

```bash
cd lumina-complete
chmod +x scripts/setup.sh
./scripts/setup.sh
```

The script will:
1. ✅ Check dependencies
2. ✅ Install packages
3. ✅ Create directories
4. ✅ Set up environment
5. ✅ Seed demo data

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Create uploads directory
mkdir uploads

# 4. Seed database (optional)
npm run seed
```

## Start the Application 🎯

### Option 1: Quick Start Script

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### Option 2: Manual Start

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Backend
npm start
# or for development with auto-reload
npm run dev

# Terminal 3: Serve Frontend
cd frontend
npx http-server -p 3000
# or just open index.html in your browser
```

## Access Lumina 🌐

1. **Frontend**: http://localhost:3000 or open `frontend/index.html`
2. **Backend API**: http://localhost:3001
3. **Health Check**: http://localhost:3001/health

## Demo Login 🔐

After seeding, use these credentials:

- **Email**: `sarah@lumina.dev`
- **Password**: `demo123`

Or create a new account directly in the app!

## Docker Quick Start 🐳

Got Docker? Even faster!

```bash
docker-compose up -d
docker-compose exec backend npm run seed
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## What's Next? 🎨

### Customize Your Experience
1. Click the ⚙️ icon (top-right)
2. Choose a theme or create custom colors
3. Adjust border roundness
4. All saved automatically!

### Create Content
1. Create posts (Journal, Idea, or Video)
2. Upload images/videos
3. Add tags for discovery
4. Share with the community

### Explore Features
- Like and comment on posts
- Follow other users
- Search for content
- View trending posts
- Check notifications

## Quick Commands 📝

```bash
# Start server
npm start

# Development mode (auto-reload)
npm run dev

# Seed database
npm run seed

# Check health
curl http://localhost:3001/health

# View logs (if using Docker)
docker-compose logs -f backend

# Stop everything (Docker)
docker-compose down
```

## Need Help? 🆘

### Common Issues

**Port 3001 already in use?**
```bash
# Change PORT in .env
PORT=3002
```

**MongoDB not running?**
```bash
# Start it
mongod
```

**Can't connect to database?**
- Check MONGODB_URI in .env
- Make sure MongoDB is running
- Try MongoDB Atlas (cloud)

### Get Support

- 📖 Read full docs: `README.md`
- 🚀 Deployment guide: `docs/DEPLOYMENT.md`
- 🐛 Report issues: GitHub Issues
- 💬 Ask questions: Discussions

## Architecture Overview 🏗️

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   MongoDB   │
│   (React)   │     │  (Express)  │     │  (Database) │
│  Port 3000  │     │  Port 3001  │     │  Port 27017 │
└─────────────┘     └─────────────┘     └─────────────┘
```

## File Structure 📁

```
lumina-complete/
├── backend/          # Express server
├── database/         # MongoDB models
├── frontend/         # React app
├── scripts/          # Helper scripts
├── uploads/          # User media
└── docs/            # Documentation
```

## Production Ready? 🚀

Check out:
- `docs/DEPLOYMENT.md` - Full deployment guide
- Update `JWT_SECRET` in .env
- Use MongoDB Atlas
- Enable HTTPS
- Set up monitoring

---

**You're all set! Enjoy Lumina! 🌟**

Questions? Check README.md or docs/ folder.
