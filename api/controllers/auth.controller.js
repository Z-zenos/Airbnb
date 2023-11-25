const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const dateFormat = require("dateformat");

const User = require('../models/user.model');
const catchErrorAsync = require('../utils/catchErrorAsync');
const AppError = require('../utils/appError');
const Email = require("../services/email.service");

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  /* Remove password from output */
  user.password = "***";

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

exports.signup = catchErrorAsync(async (req, res, next) => {
  // create: saving one or more documents to the database
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  await new Email(
    newUser,
    `${req.protocol}://${req.get('host')}/me`
  )
    .sendWelcome();

  createAndSendToken(newUser, 201, req, res);
});

exports.login = catchErrorAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // 3) If everything ok, send token to client
  createAndSendToken(user, 200, req, res);
});

exports.protect = catchErrorAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

const detectChange = (src, dest) => {
  if (!Object.keys(dest).length) return false;
  for (const key of Object.keys(dest)) {
    if (typeof src[key] === 'object' && src[key] !== null)
      if (JSON.stringify(src[key]) !== JSON.stringify(dest[key])) return true;
      else if (src[key] !== dest[key]) return true;
  }
  return false;
}

exports.detectUpdatePersonalInfo = catchErrorAsync(async (req, res, next) => {
  // 1) Detect personal info changed
  if (
    Object.keys(req.body).length &&
    Object.keys(req.body).some(k => ['email', 'name', 'phone', 'emergency_contact'].includes(k)) &&
    detectChange(req.user, req.body)
  ) {
    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return next(new AppError("There is no user with email address.", 404));

    // 2) Generate random confirm token
    const confirmToken = user.createEmailConfirmToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email

    try {
      const confirmUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email/${confirmToken}`;

      await new Email(user, `#`)
        .sendCheckEmailChanged({
          email: req.body.email,
          date: dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
          device: req.get('User-Agent')
        });

      await new Email(user, confirmUrl)
        .sendConfirmCheckEmailChanged({
          name: req.body.name,
          email: req.body.email.trim(),
          phone: req.body.phone,
          ec_name: req.body.emergency_contact.name,
          ec_relation_ship: req.body.emergency_contact.relation_ship,
          ec_email: req.body.emergency_contact.email,
          ec_phone: req.body.emergency_contact.phone,
        });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
        email: confirmUrl
      });

    } catch (err) {
      console.log(err);
      user.emailConfirmToken = undefined;
      user.emailConfirmExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('There was an error sending the email. Try again later!', 500)
      )
    }
  }
  else next();
});

exports.confirmUpdatePersonalInfo = catchErrorAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailConfirmToken: hashedToken,
    emailConfirmExpires: { '$gt': new Date().toISOString() }
  });

  // 2) If token has not expired, and there is user, set new email
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  if (req.body.email) {
    user.email = req.body.email;
    user.name = req.body.name;
    user.phone = req.body.phone;
    user.emergency_contact.name = req.body['emergency_contact.name'];
    user.emergency_contact.relation_ship = req.body['emergency_contact.relation_ship'];
    user.emergency_contact.email = req.body['emergency_contact.email'];
    user.emergency_contact.phone = req.body['emergency_contact.phone'];

    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(301).redirect(`${req.protocol}://localhost:5173/`);
  }
  else {
    return next(new AppError('Email is empty', 401));
  }
});