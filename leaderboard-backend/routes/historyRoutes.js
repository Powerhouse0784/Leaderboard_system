const express = require('express');
const {
  getUserHistory,
  getAllHistory,
} = require('../controllers/historyController');

const router = express.Router();

router.route('/')
  .get(getAllHistory);

router.route('/:userId')
  .get(getUserHistory);

module.exports = router;