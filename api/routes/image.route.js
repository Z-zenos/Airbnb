const express = require('express');

const imageController = require('../controllers/image.controller');
const placeController = require('../controllers/place.controller');

const router = express.Router();


/* NOTE: id -> placeId */

router.all('/:id/:imageName?', placeController.checkPlace);

router
  .route('/:id')
  .get(imageController.getAllImagesOfPlace)

router
  .route('/:id/:imageName')
  .delete(
    imageController.deleteImage, 
    placeController.updatePlace
  );

router
  .route('/:id/upload') // id -> placeId
  .patch(
    imageController.uploadPlaceImages, 
    imageController.resizePlaceImages,
    placeController.updatePlace
  );

module.exports = router;