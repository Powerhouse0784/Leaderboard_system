const express = require('express');
const {
  getUsers,
  createUser,
  claimPoints,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:userId/claim')
  .post(claimPoints);

router.route('/:userId')
  .delete(deleteUser);

module.exports = router;