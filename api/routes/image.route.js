const express = require('express');

const imageController = require('../controllers/image.controller');
const authController = require('../controllers/auth.controller');
const placeController = require('../controllers/place.controller');
const userController = require('../controllers/user.controller');

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


// Change user avatar
router
  .route('/user/:id/avatar')
  .patch(
    authController.protect,
    imageController.uploadUserAvatar,
    imageController.fileLimitsChecker,
    imageController.deleteUserAvatar,
    imageController.resizeUserAvatar,
    userController.updateMe
  );

module.exports = router;