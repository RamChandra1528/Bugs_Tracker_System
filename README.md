# 🐛 BugTracker Pro - Complete Issue Management System

A comprehensive, production-ready bug tracking and issue management system built with React, TypeScript, Node.js, Express, and MongoDB.

## ✨ Features

### 🏠 Professional Landing Page
- ✅ Modern, responsive design with hero section
- ✅ Feature showcase and testimonials
- ✅ Pricing plans and call-to-action
- ✅ Professional footer with company information
- ✅ Smooth navigation and animations

### 🔐 Authentication & User Management
- ✅ User Registration (Tester/Developer/Admin/Manager)
- ✅ User Login with JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Admin, Developer, Tester, Manager)
- ✅ Profile management and password change
- ✅ Admin user management with CRUD operations

### 🏢 Team Management & Organization
- ✅ Department creation and management
- ✅ Team structure within departments
- ✅ Team lead and department manager assignment
- ✅ Member assignment to teams and departments
- ✅ Role-based permissions and access control
- ✅ Timezone support (ready for implementation)
- ✅ Holiday/vacation tracking system

### 📁 Project Management
- ✅ Create and manage projects
- ✅ Assign team members to projects
- ✅ Project overview with comprehensive statistics
- ✅ Project status tracking (Active, Inactive, Completed)
- ✅ Project priority levels and deadlines

### 🐞 Bug / Issue Management
- ✅ Create, update, and delete bugs
- ✅ File attachments support with validation
- ✅ Bug assignment to developers
- ✅ Severity levels (Low, Medium, High, Critical)
- ✅ Priority levels (Low, Medium, High)
- ✅ Status tracking: Open → In Progress → Resolved → Closed
- ✅ Advanced filtering and search capabilities
- ✅ Tagging system for better organization
- ✅ Time tracking for bug resolution

### 💬 Comments & Activity Logs
- ✅ Comment system for bugs (internal/external)
- ✅ Automatic activity logging for all actions
- ✅ Real-time activity feed with timestamps
- ✅ Edit and delete comments with permissions
- ✅ Complete audit trail with IP tracking

### 🔒 Security Enhancements
- ✅ Two-factor authentication (2FA) with QR codes
- ✅ Session management with device tracking
- ✅ API rate limiting per user
- ✅ Comprehensive audit logging
- ✅ Security dashboard with threat monitoring
- ✅ IP address tracking and session control

### 📊 Dashboard & Advanced Reporting
- ✅ Comprehensive dashboard with real-time statistics
- ✅ Interactive charts (Pie charts, Bar charts, Line charts)
- ✅ Bug distribution by status, severity, and project
- ✅ Export functionality (CSV reports)
- ✅ Team performance metrics and analytics

### 📈 Advanced Analytics
- ✅ Burndown charts for sprint tracking
- ✅ Developer performance metrics
- ✅ Time tracking and resolution analytics
- ✅ Advanced filtering with saved searches
- ✅ Custom dashboard widgets (configurable)
- ✅ Trend analysis and forecasting

### 🌐 UI/UX Frontend
- ✅ Responsive design (mobile + desktop optimized)
- ✅ Role-based navigation and dashboards
- ✅ Modern, professional interface with animations
- ✅ Toast notifications for user feedback
- ✅ Form validation and error handling
- ✅ Loading states and skeleton screens
- ✅ Consistent design system with Tailwind CSS

### 🚀 Production Features
- ✅ Real-time notifications system
- ✅ Email notifications (ready for implementation)
- ✅ Full-text search capabilities
- ✅ Pagination and infinite scroll
- ✅ Data export (CSV, PDF ready)
- ✅ API documentation and health checks

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side navigation
- **Recharts** for interactive data visualization
- **Lucide React** for consistent iconography
- **Date-fns** for date formatting and manipulation
- **React Hot Toast** for user notifications

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data modeling
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Multer** for file upload handling
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **CORS** for cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bugtracker-pro
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
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bugtracker
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bugtracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
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

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use default connection string

**Option B: MongoDB Atlas (Recommended)**
1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string and update `.env`

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

### 6. Seed Database (Optional)
```bash
cd server
npm run seed
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔑 Default Test Accounts

After seeding the database:
- **Admin**: admin@bugtracker.com / password123
- **Developer**: developer@bugtracker.com / password123
- **Tester**: tester@bugtracker.com / password123

## 📁 Project Structure

```
bugtracker-pro/
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
│   ├── scripts/                 # Database scripts
│   └── uploads/                 # File upload directory
└── public/                      # Static assets
```

## 🔒 Security Features

- **JWT-based authentication** with secure token handling
- **Password hashing** with bcrypt (12 rounds)
- **Role-based access control** with granular permissions
- **Rate limiting** to prevent API abuse
- **Helmet security headers** for protection
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Two-factor authentication** with QR code setup
- **Session management** with device tracking
- **Audit logging** for all user actions

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

---

**BugTracker Pro** - The most advanced bug tracking system for modern development teams.