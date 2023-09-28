const express = require('express');

const imageController = require('../controllers/image.controller');

const router = express.Router();

// router
//   .route('/')
//   .get();

// router
//   .route('/:place')
//   .get(imageController.getAllImagesOfPlace)
  // .delete();

router
  .route('/:placeId/upload')
  .post(imageController.uploadPlaceImages, imageController.resizePlaceImages);



module.exports = router;