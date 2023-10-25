const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Interest can not be empty!']
    },
    iconImage: {
      type: String,
      required: [true, 'Interest must have icon image!']
    },
    created: {
      type: Date,
      default: Date.now
    },
    modified: {
      type: Date,
      default: Date.now
    },
    interest_id: {
      type: Number,
      required: [true, 'Interest must be have id']
    }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;