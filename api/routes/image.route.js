const express = require('express');

const imageController = require('../controllers/image.controller');
const placeController = require('../controllers/place.controller');

const router = express.Router();

// router
//   .route('/')
//   .get();

// router
//   .route('/:place')
//   .get(imageController.getAllImagesOfPlace)
  // .delete();

router
  .route('/:id/upload') // id -> placeId
  .patch(
    imageController.uploadPlaceImages, 
    imageController.resizePlaceImages,
    placeController.updatePlace
  );

module.exports = router;