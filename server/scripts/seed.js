const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const Bug = require('../models/Bug');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Bug.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const users = [
      {
        name: 'John Admin',
        email: 'admin@bugtracker.com',
        password: await bcrypt.hash('password123', 12),
        role: 'admin'
      },
      {
        name: 'Jane Developer',
        email: 'developer@bugtracker.com',
        password: await bcrypt.hash('password123', 12),
        role: 'developer'
      },
      {
        name: 'Mike Tester',
        email: 'tester@bugtracker.com',
        password: await bcrypt.hash('password123', 12),
        role: 'tester'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created users');

    // Create projects
    const projects = [
      {
        name: 'E-commerce Platform',
        description: 'Main e-commerce application with payment integration',
        members: createdUsers.map(user => user._id),
        createdBy: createdUsers[0]._id,
        status: 'active'
      },
      {
        name: 'Mobile App',
        description: 'React Native mobile application',
        members: [createdUsers[1]._id, createdUsers[2]._id],
        createdBy: createdUsers[0]._id,
        status: 'active'
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log('📁 Created projects');

    // Create bugs
    const bugs = [
      {
        title: 'Payment gateway timeout',
        description: 'Payment processing fails after 30 seconds',
        project: createdProjects[0]._id,
        reportedBy: createdUsers[2]._id,
        assignedTo: createdUsers[1]._id,
        status: 'in-progress',
        severity: 'high',
        priority: 'high',
        tags: ['payment', 'timeout']
      },
      {
        title: 'UI button misalignment',
        description: 'Submit button is not properly aligned on mobile devices',
        project: createdProjects[0]._id,
        reportedBy: createdUsers[2]._id,
        assignedTo: createdUsers[1]._id,
        status: 'open',
        severity: 'low',
        priority: 'medium',
        tags: ['ui', 'mobile']
      },
      {
        title: 'App crashes on startup',
        description: 'Application crashes when launching on Android 12',
        project: createdProjects[1]._id,
        reportedBy: createdUsers[2]._id,
        assignedTo: createdUsers[1]._id,
        status: 'resolved',
        severity: 'critical',
        priority: 'high',
        tags: ['crash', 'android']
      }
    ];

    await Bug.insertMany(bugs);
    console.log('🐛 Created bugs');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test accounts:');
    console.log('Admin: admin@bugtracker.com / password123');
    console.log('Developer: developer@bugtracker.com / password123');
    console.log('Tester: tester@bugtracker.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();