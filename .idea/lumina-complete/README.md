# 🌟 Lumina Social Learning Platform

> A modern, feature-rich social platform for sharing videos, journals, and ideas while fostering meaningful connections and collaborative learning.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication
- Password hashing with bcrypt
- User profiles with customizable bios and avatars
- Follow/unfollow system
- User preferences persistence

### 📝 Content Creation
- **Three Post Types**: Journals, Ideas, and Videos
- Rich text content up to 5000 characters
- Image and video upload support (up to 50MB)
- Tagging system for better discovery
- Post editing and deletion

### 💬 Social Interactions
- Like/unlike posts and comments
- Nested comments with replies
- Real-time notification system
- Activity tracking
- Share functionality

### 🎨 Customization System
- **6 Built-in Themes**: Light, Dark, Ocean, Purple, Nature, Custom
- Custom color picker for unlimited combinations
- Adjustable border radius (0-24px)
- Font customization options
- Persistent user preferences

### 🔍 Discovery Features
- Powerful search across posts, titles, and tags
- Trending posts algorithm
- Filter by post type
- User discovery
- Tag-based exploration

### 📱 Modern UI/UX
- Fully responsive design
- Smooth animations and transitions
- Minimalist aesthetic
- Accessible components
- Mobile-optimized

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 14.0.0
- **MongoDB** >= 4.0
- **npm** or **yarn**

### Installation

1. **Clone or download the project**
   ```bash
   cd lumina-complete
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

   This will:
   - Install all dependencies
   - Create necessary directories
   - Set up environment variables
   - Optionally seed demo data

3. **Manual setup (alternative)**
   ```bash
   npm install
   cp .env.example .env
   mkdir uploads
   npm run seed
   ```

### Starting the Application

**Option 1: Using the start script**
```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

**Option 2: Manual start**
```bash
# Start MongoDB (if not running)
mongod

# Start the backend (in another terminal)
npm start
# or for development with auto-reload
npm run dev

# Open frontend
open frontend/index.html
# or serve it with a local server
npx http-server frontend -p 3000
```

### Demo Account

After seeding, you can login with:
- **Email**: `sarah@lumina.dev`
- **Password**: `demo123`

## 📁 Project Structure

```
lumina-complete/
├── backend/
│   └── server.js              # Express API server
├── database/
│   ├── connection.js          # MongoDB connection
│   ├── models.js              # Mongoose schemas
│   └── seed.js                # Demo data seeder
├── frontend/
│   └── index.html             # React SPA
├── scripts/
│   ├── setup.sh               # Initial setup script
│   └── start.sh               # Quick start script
├── uploads/                   # User uploaded files
├── config/                    # Configuration files
├── docs/                      # Documentation
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

Edit `.env` to configure:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/lumina

# Security
JWT_SECRET=your-super-secret-key

# Frontend
FRONTEND_URL=http://localhost:3000

# Upload Limits
MAX_FILE_SIZE=52428800
```

**⚠️ Important**: Change `JWT_SECRET` to a strong random key in production!

### MongoDB Options

**Local MongoDB**:
```
MONGODB_URI=mongodb://localhost:27017/lumina
```

**MongoDB Atlas** (Cloud):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumina
```

## 🌐 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "bio": "Optional bio"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Preferences
```http
PUT /api/auth/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "theme": "dark",
  "customColors": {
    "primary": "#0A0A0A",
    "accent": "#FF6B35",
    "secondary": "#F5F5F5"
  },
  "borderRadius": 12
}
```

### Post Endpoints

#### Get Feed
```http
GET /api/posts?limit=20&offset=0
Authorization: Bearer <token>
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "My Post",
  "content": "Post content...",
  "type": "Journal",
  "tags": "tag1,tag2",
  "media": <file>
}
```

#### Like/Unlike Post
```http
POST /api/posts/:id/like
Authorization: Bearer <token>
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

### Comment Endpoints

#### Get Comments
```http
GET /api/posts/:id/comments
Authorization: Bearer <token>
```

#### Create Comment
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!",
  "parentComment": "optional-parent-id"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Follow/Unfollow User
```http
POST /api/users/:id/follow
Authorization: Bearer <token>
```

### Discovery Endpoints

#### Search Posts
```http
GET /api/search?q=keyword&type=Journal
Authorization: Bearer <token>
```

#### Get Trending
```http
GET /api/trending
Authorization: Bearer <token>
```

### Notification Endpoints

#### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

## 🎨 Customization

### Themes

Users can choose from 6 pre-built themes:
1. **Light** - Classic minimal (default)
2. **Dark** - Easy on the eyes
3. **Ocean** - Cool blue tones
4. **Purple** - Rich and vibrant
5. **Nature** - Fresh green palette
6. **Custom** - Create your own

### Custom Colors

When using the Custom theme, users can pick:
- Primary color (text/main elements)
- Accent color (buttons/highlights)
- Background color

### Border Radius

Adjust roundness from 0px (sharp) to 24px (very rounded)

All preferences are saved to localStorage and synced to the backend.

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Protected API routes
- File upload validation
- CORS configuration
- Input sanitization
- XSS protection
- Rate limiting ready

## 🚀 Deployment

### Backend (Node.js)

**Heroku**:
```bash
heroku create lumina-backend
git push heroku main
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-atlas-uri
```

**DigitalOcean/AWS/GCP**:
1. Set up a server with Node.js
2. Configure environment variables
3. Use PM2 for process management
4. Set up nginx as reverse proxy

### Database

**MongoDB Atlas** (Recommended):
1. Create a free cluster at mongodb.com/atlas
2. Whitelist your server IP
3. Get connection string
4. Update MONGODB_URI in .env

### Frontend

**Static Hosting** (Netlify/Vercel/GitHub Pages):
1. Update API_URL in frontend/index.html
2. Deploy frontend folder
3. Configure CORS on backend

### Production Checklist

- [ ] Change JWT_SECRET to strong random key
- [ ] Use MongoDB Atlas or production database
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure error monitoring (Sentry)
- [ ] Set up backups
- [ ] Enable rate limiting
- [ ] Configure CDN for uploads
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and SSL

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### Frontend
- **React** - UI library
- **Custom CSS** - Styling
- **Fetch API** - HTTP requests

### DevOps
- **Git** - Version control
- **npm** - Package management
- **nodemon** - Development

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  avatar: String,
  followers: [ObjectId],
  following: [ObjectId],
  preferences: {
    theme: String,
    customColors: Object,
    borderRadius: Number
  },
  isVerified: Boolean,
  createdAt: Date,
  lastActive: Date
}
```

### Post
```javascript
{
  author: ObjectId,
  type: String (Journal|Idea|Video),
  title: String,
  content: String,
  media: {
    url: String,
    type: String
  },
  likes: [ObjectId],
  likesCount: Number,
  commentsCount: Number,
  tags: [String],
  isPublic: Boolean,
  createdAt: Date
}
```

### Comment
```javascript
{
  post: ObjectId,
  author: ObjectId,
  content: String,
  likes: [ObjectId],
  parentComment: ObjectId,
  replies: [ObjectId],
  createdAt: Date
}
```

### Notification
```javascript
{
  recipient: ObjectId,
  sender: ObjectId,
  type: String,
  post: ObjectId,
  comment: ObjectId,
  isRead: Boolean,
  createdAt: Date
}
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env
PORT=3002
```

### MongoDB Connection Failed
```bash
# Make sure MongoDB is running
mongod

# Or update MONGODB_URI in .env
```

### File Upload Errors
```bash
# Ensure uploads directory exists
mkdir uploads

# Check file size limits in .env
```

### JWT Token Errors
```bash
# Clear browser localStorage
localStorage.clear()

# Verify JWT_SECRET is set in .env
```

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB for the database
- Express.js team
- All open source contributors

## 📧 Support

- **Email**: support@lumina.dev
- **GitHub Issues**: [github.com/lumina/issues](https://github.com)
- **Documentation**: Check `/docs` folder

---

**Built with ❤️ by the Lumina Team**

⭐ Star us on GitHub if you like the project!
