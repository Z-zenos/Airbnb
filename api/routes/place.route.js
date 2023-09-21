const express = require('express');
const placeController = require('./../controllers/place.controller');

const router = express.Router();

router
  .route('/')
  .get(placeController.getAllPlaces);
  // .post(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.createTour
  // );

router
  .route('/:id')
  .get(placeController.getPlace);
  // .patch(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   tourController.uploadTourImages,
  //   tourController.resizeTourImages,
  //   tourController.updateTour
  // )
  // .delete(
  //   authController.protect,
  //   tourController.deleteTour
  // );

module.exports = router;