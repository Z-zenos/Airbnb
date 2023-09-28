const multer = require('multer');
const sharp = require('sharp');
const Place = require('../models/place.model');

const AppError = require("../utils/appError");
const catchErrorAsync = require("../utils/catchErrorAsync");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
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
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]);

exports.resizePlaceImages = catchErrorAsync(async (req, res, next) => {
  const imageCover = req.files.imageCover[0];
  const images = req.files.images;

  if(!imageCover || !images) return next();

  // 1) Cover image
  req.body.imageCover = `place-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(imageCover.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`resources/images/places/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    images.map(async (file, i) => {
      const filename = `place-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`resources/images/places/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllImagesOfPlace = catchErrorAsync(async (req, res, next) => {
  const id = req.params.placeId;
  const place = await Place.findById(id);

  if(!place) {
    return next(new AppError('No place found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      imageCover: place.imageCover,
      images: place.images
    }
  });
});