const User = require('../models/user.model');
const catchErrorAsync = require('../utils/catchErrorAsync');
const AppError = require('../utils/appError');
const factory = require("./handlerFactory");
const Email = require("../services/email.service");
const dateFormat = require("dateformat");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(k => {
    if (allowedFields.includes(k))
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

  // Check update email
  if (req.body.email && req.user.email !== req.body.email.trim()) {
    await new Email(
      req.user,
      `${req.protocol}://${req.get('host')}/me`
    )
      .sendCheckEmailChanged({
        email: req.body.email,
        date: dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        device: req.get('User-Agent')
      });

    await new Email(
      req.user,
      `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email`
    )
      .sendConfirmCheckEmailChanged({
        name: req.user.name,
      });

    return;
    // await new Email(req.user,)
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name', 'email', 'avatar', 'interests', 'address', 'languages',
    'school', 'obsessed_with', 'useless_skill', 'time_consuming_activity',
    'work', 'favorite_song', 'fun_fact', 'biography_title',
    'pets', 'description', 'emergency_contact', 'phone'
  );
  /* 
    filteredBody: we don't want to update everything in the body because
    let say user puts in body role(ex: set to admin) -> this would allow any user
    to change the role to admin -> not allowed 
    Or user could also change reset token or when that reset token expires 
    -> We want to filter body so that in the end it only contains name, email and
    nothing else.
  */

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