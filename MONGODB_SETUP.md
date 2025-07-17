# 🗄️ MongoDB Setup Guide

## Option 1: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install MongoDB with default settings
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```
4. Verify installation:
   ```cmd
   mongo --version
   ```

### macOS
1. Install using Homebrew:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```
2. Start MongoDB:
   ```bash
   brew services start mongodb-community
   ```

### Linux (Ubuntu/Debian)
1. Import MongoDB public key:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   ```
2. Add MongoDB repository:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   ```
3. Install MongoDB:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```
4. Start MongoDB:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string
7. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker?retryWrites=true&w=majority
   ```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy and edit .env file
   cp .env.example .env
   ```

3. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔧 Troubleshooting

### Connection Refused Error
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

### Authentication Failed
- Check username/password in connection string
- Verify database user permissions in MongoDB Atlas

### Network Timeout
- Check firewall settings
- Verify IP whitelist in MongoDB Atlas
- Try using 0.0.0.0/0 for development

## 📋 Test Your Connection

Visit: http://localhost:5000/api/test-db

This endpoint will show your database connection status.

## 🔐 Default Test Accounts

After seeding, you can use these accounts:
- **Admin**: admin@bugtracker.com / password123
- **Developer**: developer@bugtracker.com / password123  
- **Tester**: tester@bugtracker.com / password123