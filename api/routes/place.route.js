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
  .route('/property-types')
  .get(placeController.getAllPropertyTypes);

router
  .route('/average-price-by-place-type')
  .get(placeController.getAveragePriceByPlaceType);

router
  .route('/search')
  .get(placeController.searchByQuery, placeController.getAllPlaces);

router
  .route('/my-places')
  .get(
    authController.protect, 
    placeController.getPlacesCreatedByUser
  );

router
  .route('/:id')
  .get(placeController.getPlace)
  .patch(
    authController.protect,
    placeController.updatePlace
  )
  // .delete(
  //   authController.protect,
  //   placeController.deleteTour
  // );


module.exports = router;