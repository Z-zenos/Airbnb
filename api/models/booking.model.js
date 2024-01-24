const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: [true, 'Booking must belong to a Place!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },

  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },

  created_at: {
    type: Date,
    default: Date.now()
  },

  updated_at: {
    type: Date,
    default: Date.now()
  },

  paid: {
    type: Boolean,
    default: true
  },

  guests: {
    type: Number,
    required: [true, 'Booking must have a guest'],
  },
  adults: Number,
  children: Number,
  pets: Number,

  checkin: {
    type: Date,
    required: [true, 'Booking must have a checkin time']
  },

  checkout: {
    type: Date,
    required: [true, 'Booking must have a checkout time']
  },

  phone: {
    type: String,
    max: [20, 'A message for host must be less than 20 characters'],
  },
  message: {
    type: String,
    max: [255, 'A message for host must be less than 255 characters'],
  },
  discount: Number,
});

bookingSchema.pre(/^find/, function (next) {
  this
    .populate('user')
    .populate({
      path: 'place',
      select: 'name'
    });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;