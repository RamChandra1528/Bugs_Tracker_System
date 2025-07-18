# 🐛 Bug Tracker / Issue Management System

A comprehensive, production-ready bug tracking and issue management system built with React, TypeScript, Node.js, Express, and MongoDB.

## ✨ Features

### 🔐 Authentication & User Management
- ✅ User Registration (Tester/Developer/Admin)
- ✅ User Login with JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Admin, Developer, Tester)
- ✅ Profile management and password change
- ✅ Admin user management

### 📁 Project Management
- ✅ Create and manage projects
- ✅ Assign team members to projects
- ✅ Project overview with statistics
- ✅ Project status tracking

### 🐞 Bug / Issue Management
- ✅ Create, update, and delete bugs
- ✅ Bug assignment to developers
- ✅ Severity levels (Low, Medium, High, Critical)
- ✅ Priority levels (Low, Medium, High)
- ✅ Status tracking: Open → In Progress → Resolved → Closed
- ✅ Advanced filtering and search
- ✅ Tagging system
- ✅ File attachments support

### 💬 Comments & Activity Logs
- ✅ Comment system for bugs
- ✅ Automatic activity logging
- ✅ Real-time activity feed
- ✅ Edit and delete comments

### 📊 Dashboard & Reporting
- ✅ Comprehensive dashboard with statistics
- ✅ Interactive charts (Pie charts, Bar charts, Line charts)
- ✅ Bug distribution by status, severity, and project
- ✅ Export functionality (CSV)
- ✅ Team performance metrics

### 🌐 UI/UX Frontend
- ✅ Responsive design (mobile + desktop)
- ✅ Role-based navigation
- ✅ Modern, professional interface
- ✅ Form validation
- ✅ Loading states and error handling

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **Date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security
- **Express Rate Limit** for API protection

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bug-tracker-system
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bugtracker
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bugtracker

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Create a `.env.local` file in the root directory for frontend:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

Make sure MongoDB is running on your system or configure MongoDB Atlas connection string in the `.env` file.

### 5. Start the Application

#### Option 1: Start both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Start separately

**Backend:**
```bash
cd server
npm run dev
```

**Frontend (in another terminal):**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔑 Default Admin Account

After starting the application, you can register a new admin account or create one directly in the database.

## 📁 Project Structure

```
bug-tracker-system/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── auth/                # Authentication components
│   │   ├── common/              # Reusable components
│   │   ├── dashboard/           # Dashboard components
│   │   └── layout/              # Layout components
│   ├── context/                 # React context providers
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components
│   ├── services/                # API service layer
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── server/                      # Backend source code
│   ├── config/                  # Database configuration
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Express middleware
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   └── uploads/                 # File upload directory
└── public/                      # Static assets
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Helmet security headers
- Input validation and sanitization
- CORS configuration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Bugs
- `GET /api/bugs` - Get all bugs (with filtering)
- `GET /api/bugs/stats` - Get bug statistics
- `GET /api/bugs/:id` - Get bug by ID
- `POST /api/bugs` - Create bug
- `PUT /api/bugs/:id` - Update bug
- `DELETE /api/bugs/:id` - Delete bug

### Comments
- `GET /api/comments/bug/:bugId` - Get comments for bug
- `POST /api/comments/bug/:bugId` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🚀 Deployment

### Frontend (Vercel)
1. Build the frontend: `npm run build`
2. Deploy to Vercel
3. Configure environment variables

### Backend (Railway/Render/Heroku)
1. Set up MongoDB Atlas for production database
2. Configure environment variables
3. Deploy the `server` directory
4. Update CORS settings for production frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.