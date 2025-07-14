const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to get users ranked by points
UserSchema.statics.getRankedUsers = async function () {
  return this.aggregate([
    {
      $setWindowFields: {
        sortBy: { points: -1 },
        output: {
          rank: {
            $denseRank: {},
          },
        },
      },
    },
  ]);
};

module.exports = mongoose.model('User', UserSchema);