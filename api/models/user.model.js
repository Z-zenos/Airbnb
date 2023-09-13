const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name.'],
      trim: true,
      maxlength: [255, "Name must be less than 256 characters."],
      minlength: [4, "Name must be greater than 3 characters."]
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
      select: false
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    avtive: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Select all users are currently active
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
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

const User = mongoose.model('Users', userSchema);

module.exports = User;