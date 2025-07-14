const History = require('../models/History');

// @desc    Get claim history for a user
// @route   GET /api/history/:userId
// @access  Public
exports.getUserHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const history = await History.find({ user: userId })
      .sort({ claimedAt: -1 })
      .populate('user', 'name');
    
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all claim history
// @route   GET /api/history
// @access  Public
exports.getAllHistory = async (req, res, next) => {
  try {
    const history = await History.find()
      .sort({ claimedAt: -1 })
      .populate('user', 'name');
    
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};