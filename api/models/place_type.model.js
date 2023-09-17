const mongoose = require('mongoose');

const placeTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place type can not be empty!']
    },
    iconImage: {
      type: String,
      required: [true, 'Place type must have icon image!']
    },
    created: {
      type: Date,
      default: Date.now
    },
    modified: {
      type: Date,
      default: Date.now
    }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const PlaceType = mongoose.model('Place_type', placeTypeSchema);

module.exports = PlaceType;