const fs = require('fs').promises;
const multer = require('multer');
const sharp = require('sharp');

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
  { name: 'image_cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]);

exports.uploadUserAvatar = upload.fields([
  { name: 'avatar', maxCount: 1 }
]);

exports.resizePlaceImages = catchErrorAsync(async (req, res, next) => {
  const image_cover = req.files?.image_cover[0];
  const images = req.files?.images;

  if(!image_cover || !images) return next();

  // 1) Cover image
  req.body.image_cover = `place-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(image_cover.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`resources/images/places/${req.body.image_cover}`);

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

exports.resizeUserAvatar = catchErrorAsync(async (req, res, next) => {
  const [avatar] = req.files?.avatar;

  if(!avatar) return next();

  // 1) Cover avatar
  req.body.avatar = `user-${req.params.id}-${Date.now()}-avatar.jpeg`;
  await sharp(avatar.buffer)
    .resize(512, 512)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`resources/images/users/avatars/${req.body.avatar}`);

  next();
});

exports.getAllImagesOfPlace = catchErrorAsync(async (req, res, next) => {
  const place = req.place;

  res.status(200).json({
    status: 'success',
    data: {
      image_cover: place.image_cover,
      images: place.images
    }
  });
});

exports.deleteImage = catchErrorAsync(async (req, res, next) => {
  const { imageName } = req.params;
  const place = req.place;  

  if(imageName === place.image_cover) {
    place.image_cover = req.body.image_cover = undefined; 
  }
  else {
    for(let i = 0; i < place.images.length; i++) {
      if(place.images[i] === imageName) {
        req.body.images = place.images.filter(i => i !== imageName);
        break;
      }
    }
  }

  const imagePath = `${__dirname}/../resources/images/places/${imageName}`;
  await fs.unlink(imagePath);

  next();
  
});