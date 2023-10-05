const express = require('express');
const placeController = require('./../controllers/place.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(placeController.getAllPlaces)
  .post(
    authController.protect,
    placeController.createPlace
  );


router
  .route('/place-types')
  .get(placeController.getAllPlaceTypes);

router
  .route('/my-places')
  .get(
    authController.protect, 
    placeController.getPlacesCreatedByUser
  );

router
  .route('/:id')
  .get(placeController.getPlace);
  // .patch(
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  //   placeController.uploadTourImages,
  //   placeController.resizeTourImages,
  //   placeController.updateTour
  // )
  // .delete(
  //   authController.protect,
  //   placeController.deleteTour
  // );


module.exports = router;