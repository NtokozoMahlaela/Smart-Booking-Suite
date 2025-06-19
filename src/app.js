require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Booking Suite API' });
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// Test protected route
app.get('/api/protected', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'You have accessed a protected route',
    user: req.user
  });
});

// Test admin route
app.get('/api/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'You have accessed an admin route',
    user: req.user
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
