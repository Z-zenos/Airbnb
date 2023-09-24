const catchErrorAsync = require('../utils/catchErrorAsync');
const Place = require('./../models/place.model');
const PlaceType = require('../models/place_type.model');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getAllPlaces = factory.getAll(Place);
exports.getPlace = factory.getOne(Place);
// exports.createPlace = factory.createOne(Place);
// exports.updatePlace = factory.updateOne(Place);
// exports.deletePlace = factory.deleteOne(Place);

exports.getAllPlaceTypes = catchErrorAsync(async(req, res, next) => {
  const placeTypeList = await PlaceType.find({}, { name: 1, iconImage: 1 });

  if (!placeTypeList) {
    return next(new AppError(`Place type list is empty`, 404));
  }

  res.status(200).json({
    status: 'success',
    result: placeTypeList.length,
    data: {
      placeTypeList
    }
  })
});