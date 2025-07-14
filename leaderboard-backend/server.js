require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');
const errorHandler = require('./middlewares/error');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Initialize Socket.IO
initSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

const prepopulateUsers = async () => {
  const User = require('./models/User');
  const count = await User.countDocuments();
  
  if (count === 0) {
    const users = [
      'Rahul',
      'Kamal',
      'Sanak',
      'Priya',
      'Amit',
      'Neha',
      'Vikram',
      'Sonia',
      'Raj',
      'Anjali'
    ];
    
    await User.insertMany(users.map(name => ({ name })));
    console.log('Prepopulated 10 users');
  }
};

// Call it after connectDB()
connectDB().then(prepopulateUsers);