const express = require('express');

const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const placeController = require('../controllers/place.controller');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers);

router.all('/me', authController.protect);
router
  .route('/me')
  .get(userController.me)
  .patch(authController.detectUpdatePersonalInfo, userController.updateMe);

router
  .route('/profile/:id')
  .get(userController.getUser)
// .patch(userController);

router
  .route('/:id/places')
  .get(placeController.getPlacesOfUser);

router
module.exports = router;