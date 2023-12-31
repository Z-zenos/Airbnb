const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Interest = require('./interest.model');
const Place = require('./place.model');
const AppError = require('../utils/appError');
const emergencyContactSchema = require('./emergency_contact.model');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name.'],
      trim: true,
      maxlength: [255, "Name must be less than 256 characters."],
      minlength: [4, "Name must be greater than 3 characters."]
    },

    phone: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your phone.'],
      unique: true,
      // validate: [validator.isNumeric, 'Please provide a valid phone.']
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description must be less than 1000 characters."],
    },

    email: {
      type: String,
      required: [true, 'Please provide your email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.']
    },

    avatar: {
      type: String,
      default: 'default.jpg'
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'This role is not exist.'
      },
      default: 'user'
    },

    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: 4,
      maxlength: 100,
      select: false
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      minlength: 4,
      maxlength: 100,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },

    passwordChangedAt: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    reviewAccountToken: String,
    reviewAccountExpires: Date,

    emailChangeAt: Date,
    emailConfirmToken: String,
    emailConfirmExpires: Date,

    active: {
      type: Boolean,
      default: true,
      select: false
    },

    school: {
      type: String,
      trim: true,
      maxlength: [100, 'School must be less than 100 characters.']
    },
    address: String,
    decade_born: String,
    obsessed_with: {
      type: String,
      trim: true,
      maxlength: [100, 'Obsessed with must be less than 100 characters.']
    },
    useless_skill: {
      type: String,
      trim: true,
      maxlength: [100, 'Useless skill must be less than 100 characters.']
    },
    time_consuming_activity: {
      type: String,
      trim: true,
      maxlength: [100, 'Time-consuming activity must be less than 100 characters.']
    },
    work: {
      type: String,
      trim: true,
      maxlength: [100, 'Work name must be less than 100 characters.']
    },
    languages: [String],
    favorite_song: {
      type: String,
      trim: true,
      maxlength: [100, 'Favorite song must be less than 100 characters.']
    },
    fun_fact: {
      type: String,
      trim: true,
      maxlength: [100, 'Fun fact must be less than 100 characters.']
    },
    biography_title: {
      type: String,
      trim: true,
      maxlength: [100, 'Biography title must be less than 100 characters.']
    },
    pets: [String],

    interests: [{
      type: mongoose.Schema.ObjectId,
      ref: Interest,
    }],

    showPastTrips: Boolean,
    year_hosting: Number,

    emergency_contact: {
      type: emergencyContactSchema,
      default: () => ({})
    },

    wishlists: [{
      type: mongoose.Schema.ObjectId,
      ref: Place,
    }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// userSchema.virtual('places', {
//   ref: 'Place',
//   foreignField: 'host',
//   localField: '_id'
// });

// userSchema.virtual('places').get(async function() {
//   const places = await Place.find({ host: new mongoose.Types.ObjectId(this._id) });
//   console.log(places);
//   return places;
// });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('email') || this.isNew) return next();

  this.emailChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.interests)
    if (this._update.interests.length > 10) return next(new AppError("The user is trying to select more than 10 interests. ", 400));
  next();
});

// Select all users are currently active
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'interests',
    select: '-__v -created -modified'
  });

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.changedEmailAfter = function (JWTTimestamp) {
  if (this.emailChangeAt) {
    const changedTimestamp = parseInt(
      this.emailChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createEmailConfirmToken = function () {
  const confirmToken = crypto.randomBytes(128).toString('hex');

  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  this.emailConfirmExpires = Date.now() + 10 * 60 * 1000;

  return confirmToken;
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

userSchema.methods.createReviewAccountToken = function () {
  const reviewAccountToken = crypto.randomBytes(32).toString('hex');
  this.reviewAccountToken = crypto
    .createHash('sha256')
    .update(reviewAccountToken)
    .digest('hex');

  this.reviewAccountExpires = Date.now() + 10 * 60 * 1000;
  return reviewAccountToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;