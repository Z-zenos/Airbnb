const catchErrorAsync = require('../utils/catchErrorAsync');
const Place = require('./../models/place.model');
const PropertyType = require('../models/property_type.model');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const mongoose = require("mongoose");
const APIFeatures = require('../utils/apiFeatures');

exports.getAllPlaces = factory.getAll(Place);
exports.getPlace = factory.getOne(Place);
exports.checkPlace = factory.checkOne(Place);

exports.createPlace = catchErrorAsync(async(req, res, next) => {
  const newPlace = await Place.collection.insertOne(
    {
      property_type: "",
      location: {
        address: ""
      },
      guests: 1,
      bedrooms:1,
      bathrooms: 1,
      beds: 1,
      image_cover: "",
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

exports.getAllPropertyTypes = catchErrorAsync(async(req, res, next) => {
  const propertyTypeList = await PropertyType.find({}, { name: 1, iconImage: 1 });

  if (!propertyTypeList) {
    return next(new AppError(`Place type list is empty`, 404));
  }

  res.status(200).json({
    status: 'success',
    result: propertyTypeList.length,
    data: {
      propertyTypeList
    }
  });
});

exports.getPlacesCreatedByUser = catchErrorAsync(async(req, res, next) => {
  let places = Array.from(await Place.find({ host: req.user.id }));

  places = places.map(place => place.property_type ? place : { ...place._doc, property_type: "" });

  res.status(200).json({
    status: 'success',
    result: places.length,
    data: {
      places
    }
  });
});

exports.getAveragePriceByPlaceType = catchErrorAsync(async(req, res, next) => {
  const averages = await Place.aggregate([
    {
      $match: {
        status: 'published'
      }
    },
    {
      $group: {
        _id: '$place_type',
        average: { $avg: "$price" },
        totalPlaces: { $sum: 1 },
        totalPrices: { $sum: '$price' }
      }
    },
    {
      $project: {
        type: '$_id',
        avg: { $round: '$average' },
        _id: 0,
        totalPrices: 1,
        totalPlaces : 1,
      }
    }
  ]);

  averages.push({
    type: 'any type',
    avg: Math.trunc(averages.reduce((acc, avg) => acc + avg.totalPrices, 0) / averages.reduce((acc, avg) => acc + avg.totalPlaces, 0))
  });

  res.status(200).json({
    status: 'success',
    data: {
      averages
    }
  });
});

exports.searchByQuery = (req, res, next) => {
  const { query } = req;
  let queryObj = {};

  if(query.children) queryObj['rules.children'] = +query.children;
  if(query.pets) queryObj['rules.pets'] = +query.pets;
  if(query.adults) queryObj.guests = { 'gte': +query.adults + (+query.children || 0) };
  if(query.checkin ) {
    const date = new Date(+query.checkin);
    queryObj['checkinout.checkin_date'] = { 'gte': new Date(date.setDate(date.getDate() + 1)) };
  }
    
  if(query.checkout) {
    const date = new Date(+query.checkout);
    queryObj['checkinout.checkout_date'] = { 'lte': new Date(date.setDate(date.getDate() + 1)) };
  }

  if(query.region && query.region !== 'Any') queryObj['location.region'] = query.region;
  if(query.address) {
    queryObj['$text'] = {
      '$search': query.address
    };
  }
  const searchCriteria = ['children', 'pets', 'adults', 'checkin', 'checkout', 'region', 'address'];
  searchCriteria.forEach(sc => {
    if(query[sc]) delete query[sc];
  });

  req.query = {...queryObj, ...query };
  next();
};

exports.countPlace = catchErrorAsync(async (req, res, next) => {
  const features = new APIFeatures(Place.find()).count(APIFeatures.parse(req.query));

  const docs = await features.Query;

  res.status(200).json({
    status: 'success',
    count: docs,
  });
});