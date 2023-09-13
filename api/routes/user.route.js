const express = require('express');

const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers);

router.get('/profile', authController.protect, userController.profile);

module.exports = router;