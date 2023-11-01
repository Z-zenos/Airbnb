const express = require('express');

const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const placeController = require('../controllers/place.controller');


const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/profile')
  .get(authController.protect, userController.profile);

router
  .route('/profile/:id')
  .get(userController.getUser);

router
  .route('/:id/places')
  .get(placeController.getPlacesOfUser);

module.exports = router;