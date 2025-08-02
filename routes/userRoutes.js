// routes/userRoutes.js
const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

const router = express.Router();

router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
