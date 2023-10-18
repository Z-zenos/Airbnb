const mongoose = require('mongoose');
const slugify = require('slugify');
const PropertyType = require('./property_type.model');
const Amenity = require('./amenity.model');
const safetySchema = require('./safety.model');
const checkinoutSchema = require('./checkinout.model');
const ruleSchema = require('./rule.model');
const View = require('./view.model');

const placeSchema = new mongoose.Schema(
  {
    // Name have a-z, 0-9, some special characters
    name: {
      type: String,
      required: [true, 'A place must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'A place name must have less or equal than 255 characters'],
      minlength: [10, 'A place name must have more or equal than 10 characters']
    },

    property_type: {
      type: mongoose.Schema.ObjectId,
      ref: PropertyType,
    },

    place_type: {
      type: String,
      enum: {
        values: ['room', 'entire home', 'shared room'],
        message: 'Property type is either: room, entire home, shared room'
      },
      required: [true, "A place must be have a type"]
    },

    slug: String,
    language: String,
    built: Number,

    guests: {
      type: Number,
      required: [true, 'A place must have a guest'],
      min: [1, 'A place must have more or equal than 1 person'],
    },

    bedrooms: {
      type: Number,
      required: [true, 'A place must have a bedroom'],
      min: [1, 'A place must have more or equal than 1 bedroom'],
      max: [50, 'A place must have less or equal than 50 bedrooms'],
    },

    beds: {
      type: Number,
      required: [true, 'A place must have a bed'],
      min: [1, 'A place must have more or equal than 1 bed'],
      max: [50, 'A place must have less or equal than 50 beds'],
    },

    /*
      Bathroom have 0.5 bathroom, 1 bathroom -> float number
      Ex: 2.5 bathrooms means there are 2 full bathrooms and 1 - 1/2 bathroom.
      A full bathroom has either a sink and toilet and tub OR a sink and toilet and 
      shower. ( It could also have sink and toilet and tub and shower. )

      In other words the full bath has a bathing facility as well as sink and toilet.

      A half bathroom has only a sink and toilet . Sometimes this is also called a “ 
      Powder Room “.
    */
    bathrooms: {
      type: Number,
      required: [true, 'A place must have a bathroom'],
      min: [1, 'A place must have more or equal than 1 bathroom'],
      max: [50, 'A place must have less or equal than 50 bathrooms'],
    },

    amenities: [{
      type: mongoose.Schema.ObjectId,
      ref: Amenity,
    }],

    average_ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 100) / 100
    },

    quantity_ratings: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, 'A place must have a price']
    },

    price_type: {
      type: String,
      // required: [true, 'A place must have a price type'],
      enum: {
        values: ['night', 'week', 'month'],
        message: 'Difficulty is either: night, week, month'
      }
    },

    price_discount: {
      type: Number
    },

    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'A place name must have less or equal than 5000 characters'],
      required: [true, 'A place must have description']
    },

    image_cover: {
      type: String,
      required: [true, 'A place must have a cover image']
    },

    images: {
      type: [String],
      required: [true, 'A place must have images'],
      validate: {
        validator: function (val) {
          return val.length >= 5;
        },
        message: "Place's images must more than 5 images"
      }
    },

    created: {
      type: Date,
      default: Date.now(),
      select: false
    },

    modified: {
      type: Date,
      default: Date.now(),
      select: false
    },

    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      address: {
        type: String,
        text: true,
        index: true
      },
      coordinates: [Number],
      country: String,
      description: String,
      zipCode: String,
      flag: String,
      region: String,
    },

    views: [{
      type: mongoose.Schema.ObjectId,
      ref: View,
    }],

    rules: {
      type: ruleSchema,
      default: () => ({})
    },

    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A place must be hosted by certain host']
    },

    status: {
      type: String,
      enum: {
        values: ['creating', 'published', 'deactivated'],
        message: 'status is either: creating, published, deactivated'
      }
    },
    
    safety: {
      type: safetySchema,
      default: () => ({}),
      required: [true, 'A place must be have safety']
    },

    checkinout: {
      type: checkinoutSchema,
      default: () => ({})
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// // placeSchema.index({ price: 1 });
// placeSchema.index({ price: 1, ratingsAverage: -1 });
placeSchema.index({ 'location.address': "text" });
// placeSchema.index({ startLocation: '2dsphere' });

// placeSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// // Virtual populate
// placeSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'place',
//   localField: '_id'
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
placeSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// placeSchema.pre('save', async function(next) {
//   next();
// });

// placeSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// placeSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

placeSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'property_type',
    select: '-__v -_id -created -modified'
  }).populate({
    path: 'amenities',
    select: '-__v -created -modified -_id'
  }).populate({
    path: 'views',
    select: '-__v'
  });

  next();
});

// placeSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// placeSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretplace: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;