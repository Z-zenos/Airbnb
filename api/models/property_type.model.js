const mongoose = require('mongoose');

const propertyTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Property type can not be empty!']
    },

    iconImage: {
      type: String,
      required: [true, 'Property type must have icon image!']
    },

    created: {
      type: Date,
      default: Date.now
    },
    modified: {
      type: Date,
      default: Date.now
    },

    place_type: {
      type: [String],
      enum: {
        values: ['room', 'entire home', 'shared room'],
        message: 'Property type is either: room, entire home, shared room'
      },
      required: [true, "A place must be have a type"]
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const PropertyType = mongoose.model('Property_type', propertyTypeSchema);

module.exports = PropertyType;