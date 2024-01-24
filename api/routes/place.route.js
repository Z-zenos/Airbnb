const express = require('express');
const placeController = require('./../controllers/place.controller');
const authController = require('./../controllers/auth.controller');

const router = express.Router();

router.get('/', placeController.getAllPlaces);

router
  .route('/become-a-host/:id?')
  .all(authController.protect)
  .get(placeController.getPlacesCreatedByUser)
  .post(placeController.createPlace)
  .patch(placeController.updatePlace);

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
  .route('/count-place')
  .get(placeController.searchByQuery, placeController.countPlace);

router
  .route('/:id')
  .get(placeController.getPlace)
  .patch(
    authController.protect,
    placeController.updatePlace
  )
// .delete(
//   authController.protect,
//   placeController.deletePlace
// );


module.exports = router;