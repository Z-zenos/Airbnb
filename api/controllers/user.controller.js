const User = require('../models/user.model');
const catchErrorAsync = require('../utils/catchErrorAsync');
const AppError = require('../utils/appError');
const factory = require("./handlerFactory");

const filterObj = (obj, ...ignoreFields) => {
  const newObj = {};

  Object.keys(obj).forEach(k => {
    if (!ignoreFields.includes(k))
      newObj[k] = obj[k];
  });

  return newObj;
};

exports.me = (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
};

exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchErrorAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'email', 'role', 'password', 'passwordConfirm', 'active',
    'phone', 'name', 'emergency_contact'
  );

  // 3) Update user document
  /* 
    We not use save() method here because we're not dealing with password, but only
    with non-sensitive data like name, email -> we now use findByIdAndUpdate.
  */
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchErrorAsync(async (req, res, next) => {
  /* 
    When user decides to delete his account, we actually do not delete that 
    document from database, but instead we just set account to inactive, so
    that user might at some point in the future want to re-activate the account
    and we still can access that account in the future even if officially let's
    say it has been deleted     
  */
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = factory.getOne(User);

// Do NOT update password with this!
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.updateWishlists = catchErrorAsync(async (req, res, next) => {
  const { place_id, state } = req.body;

  const user = await User.findById(req.user.id);

  if (state === 'heart')
    user.wishlists.push(place_id);
  else if (state === 'unheart')
    user.wishlists.splice(user.wishlists.indexOf(place_id), 1);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});