const catchErrorAsync = require("../utils/catchErrorAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.deleteOne = Model => catchErrorAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  const name = Model.modelName.toLowerCase();

  if (!doc) {
    return next(new AppError(`No ${name} found with that ID`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateOne = Model => catchErrorAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  const name = Model.modelName.toLowerCase();

  if (!doc) {
    return next(new AppError(`No ${name} found with that ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      [name]: doc
    }
  });
});

exports.createOne = Model => catchErrorAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      [Model.modelName.toLowerCase()]: doc
    }
  });
});

exports.getOne = (Model, popOptions) => catchErrorAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);

  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.getAll = Model => catchErrorAsync(async (req, res, next) => {

  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  console.log("filter (tour, user): ", filter);

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const docs = await features.Query;

  res.status(200).json({
    status: 'success',
    result: docs.length,
    data: {
      [Model.modelName.toLowerCase()]: docs
    }
  });
});