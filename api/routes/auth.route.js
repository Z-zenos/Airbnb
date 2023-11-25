const express = require('express');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/confirm-email/:token', authController.confirmChangeEmail);

module.exports = router;