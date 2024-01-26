const fs = require('fs').promises;
const multer = require('multer');
const sharp = require('sharp');

const AppError = require("../utils/appError");
const catchErrorAsync = require("../utils/catchErrorAsync");
const Place = require('../models/place.model');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400));
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: process.env.MAX_FILE_SIZE }
});

exports.uploadPlaceImages = upload.fields([
  { name: 'images', maxCount: 10 }
]);

exports.uploadUserAvatar = upload.fields([
  { name: 'avatar', maxCount: 1 }
]);

exports.fileLimitsChecker = catchErrorAsync(async (req, res, next) => {
  if (!Object.keys(req.files).length)
    return next(new AppError("Image missing", 400));

  Object.keys(req.files).forEach(imageField => {
    req.files[imageField].forEach(file => {
      if (file.size > process.env.MAX_FILE_SIZE) {
        return next(new AppError(`File too large. max ${process.env.MAX_FILE_SIZE}, received ${req.file.size}`, 400));
      }
    });
  });

  next();
});

exports.resizePlaceImages = catchErrorAsync(async (req, res, next) => {
  const placeId = req.params.id;
  const place = await Place.findById(placeId);
  const images = req.files?.images || [];

  if (place.images.length > 10) {
    return next(new AppError("Reached maximum 10 photos for this place!", 404));
  }

  if (place.images.length + images.length > 10) {
    return next(new AppError("You can only upload maximum 10 photos for each place!", 404));
  }

  req.body.images = [...place.images];
  if (images?.length) {
    await Promise.all(
      images.map(async (file, i) => {
        const filename = `place-${placeId}-${Date.now()}-${i + place.images.length}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`resources/images/places/${filename}`);

        req.body.images.push(filename);
      })
    );
  }
  next();
});

exports.resizeUserAvatar = catchErrorAsync(async (req, res, next) => {
  const [avatar] = req.files?.avatar;

  if (!avatar) return next();

  req.body.avatar = `user-${req.params.id}-${Date.now()}-avatar.jpeg`;
  await sharp(avatar.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`resources/images/users/avatars/${req.body.avatar}`);

  next();
});

exports.deleteUserAvatar = catchErrorAsync(async (req, res, next) => {
  const user = req.user;

  const imagePath = `${__dirname}/../resources/images/users/avatars/${user.avatar}`;

  let exists = await fs.access(imagePath).then(() => true).catch(() => false);
  if (exists) await fs.unlink(imagePath);
  user.avatar = undefined;

  next();

});

exports.getAllImagesOfPlace = catchErrorAsync(async (req, res, next) => {
  const place = req.place;

  res.status(200).json({
    status: 'success',
    data: {
      images: place.images
    }
  });
});

exports.deleteImage = catchErrorAsync(async (req, res, next) => {
  const { imageName } = req.params;
  const place = req.place;

  for (let i = 0; i < place.images.length; i++) {
    if (place.images[i] === imageName) {
      req.body.images = place.images.filter(i => i !== imageName);
      break;
    }
  }

  const imagePath = `${__dirname}/../resources/images/places/${imageName}`;
  await fs.unlink(imagePath);

  next();

});

/**
 * How to remove completely 1 fields away from place model:
  Open mongo compass shell
 * use airbnb
 * db.places.update({}, {$unset: {image_cover: 1}} , {multi: true})
 * 
 */