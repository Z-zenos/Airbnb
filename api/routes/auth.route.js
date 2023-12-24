const express = require('express');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/confirm-email/:token', authController.confirmUpdatePersonalInfo);

// forgot password only receive the email address
// router.post('/forgotPassword', authController.forgotPassword); // get only email address

// receive token, and set new password
// router.patch('/resetPassword/:token', authController.resetPassword); // get token along new password

router.use(authController.protect); // Protect all routes that come after this point.
router.patch('/updateMyPassword', authController.updatePassword);

module.exports = router;