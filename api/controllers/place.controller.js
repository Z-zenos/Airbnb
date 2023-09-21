
const Place = require('./../models/place.model');
const factory = require('./handlerFactory');

exports.getAllPlaces = factory.getAll(Place);
exports.getPlace = factory.getOne(Place);
// exports.createPlace = factory.createOne(Place);
// exports.updatePlace = factory.updateOne(Place);
// exports.deletePlace = factory.deleteOne(Place);