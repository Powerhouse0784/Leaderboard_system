const User = require('../models/User');
const History = require('../models/History');
const { getIO } = require('../config/socket');

// @desc    Get all users with rankings
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.getRankedUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this name already exists' 
      });
    }

    const user = await User.create({ name });
    
    // Emit user creation event to all clients
    const io = getIO();
    const users = await User.getRankedUsers();
    io.emit('usersUpdated', users);
    
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Claim random points for a user
// @route   POST /api/users/:userId/claim
// @access  Public
exports.claimPoints = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Generate random points between 1 and 10
    const points = Math.floor(Math.random() * 10) + 1;
    
    // Update user's points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Create history record
    await History.create({ user: userId, points });
    
    // Get updated ranked users
    const users = await User.getRankedUsers();
    
    // Emit update to all clients
    const io = getIO();
    io.emit('usersUpdated', users);
    io.emit('pointsClaimed', { userId, points });
    
    res.status(200).json({ 
      success: true, 
      data: { user, points } 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:userId
// @access  Public
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Also delete associated history
    await History.deleteMany({ user: userId });
    
    // Get updated ranked users
    const users = await User.getRankedUsers();
    
    // Emit update to all clients
    const io = getIO();
    io.emit('usersUpdated', users);
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};