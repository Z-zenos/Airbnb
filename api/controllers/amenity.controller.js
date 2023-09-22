const Amenity = require('./../models/amenity.model');
const factory = require('./handlerFactory');
const catchErrorAsync = require('../utils/catchErrorAsync');
const path = require('path');

exports.getAllAmenities = factory.getAll(Amenity);

exports.getAmenity = catchErrorAsync(async (req, res, next) => {
  let amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).sendFile(path.resolve(`${__dirname}/../resources/images/amenities/${amenity.iconImage}`));
});

exports.createAmenity = factory.createOne(Amenity);
exports.updateAmenity = factory.updateOne(Amenity);
exports.deleteAmenity = factory.deleteOne(Amenity);