const express = require('express');

const amenityController = require('../controllers/amenity.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(amenityController.getAllAmenities);

router
  .route('/:id')
  .get(amenityController.getAmenity);

module.exports = router;