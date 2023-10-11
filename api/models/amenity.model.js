const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Amenity can not be empty!']
    },
    iconImage: {
      type: String,
      required: [true, 'Amenity must have icon image!']
    },
    created: {
      type: Date,
      default: Date.now
    },
    modified: {
      type: Date,
      default: Date.now
    },
    shortenDesc: String,
    isEssential: Boolean,
    
    // type also is amenity but it is more generic, no have icon image.
    type: {
      type: mongoose.Schema.ObjectId,
      ref: 'Amenity'
    },
    amenity_id: {
      type: Number,
      required: [true, 'Amenity must be have id']
    }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity;