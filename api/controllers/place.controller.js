const catchErrorAsync = require('../utils/catchErrorAsync');
const Place = require('./../models/place.model');
const PlaceType = require('../models/place_type.model');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const mongoose = require("mongoose");

exports.getAllPlaces = factory.getAll(Place);
exports.getPlace = factory.getOne(Place);
exports.checkPlace = factory.checkOne(Place);

exports.createPlace = catchErrorAsync(async(req, res, next) => {
  const newPlace = await Place.collection.insertOne(
    {
      placeType: "",
      location: {
        address: ""
      },
      guests: 1,
      bedrooms:1,
      bathrooms: 1,
      beds: 1,
      imageCover: "",
      images: [],
      amenities: [],
      description: "<p>Feel refreshed when you stay in this rustic gem.</p>",
      name: "",
      price: 1,
      host: new mongoose.Types.ObjectId(req.user.id),
      status: "creating"
    }
  );

  const insertedPlace = await Place.findById(newPlace.insertedId);

  res.status(201).json({
    status: 'success',
    data: {
      place: insertedPlace
    }
  });
});

exports.updatePlace = factory.updateOne(Place);
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

exports.getPlacesCreatedByUser = catchErrorAsync(async(req, res, next) => {
  let places = Array.from(await Place.find({ host: req.user.id }));

  places = places.map(place => place.placeType ? place : { ...place._doc, placeType: "" });

  res.status(200).json({
    status: 'success',
    result: places.length,
    data: {
      places
    }
  })
});