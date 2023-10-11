const mongoose = require('mongoose');

const checkinoutSchema = new mongoose.Schema(
  {
    checkin_method: {
      type: String,
      required: [true, "A place must be have check in method"],
      enum: {
        values: ['smart lock', 'keypad', 'lockbox', 'building staff', 'in-person greeting', 'other'],
        message: "checkin method is either: 'smart lock', 'keypad', 'lockbox', 'building staff', 'in-person greeting', 'other'"
      },
      default: 'smart lock'
    },

    checkout_instructions: {
      type: String,
    },

    checkin_date: {
      type: Date,
      default: Date.now,
      required: [true, "A place must be have check in date"]
    },

    checkout_date: {
      type: Date,
      default: Date.now,
      required: [true, "A place must be have check in date"]
    },

    description: {
      type: String,
    }
  }
);

module.exports = checkinoutSchema;