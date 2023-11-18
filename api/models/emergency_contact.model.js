const mongoose = require('mongoose');
const validator = require('validator');

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [255, "Name must be less than 255 characters."],
      minlength: [4, "Name must be greater than 3 characters."]
    },

    phone: {
      type: String,
      trim: true,
      validate: [validator.isNumeric, 'Please provide a valid phone.']
    },

    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.']
    },

    relation_ship: {
      type: String,
      trim: true,
      maxlength: [255, "Relation ship must be less than 255 characters."],
      minlength: [4, "Relation ship must be greater than 3 characters."]
    },
  }
);

module.exports = emergencyContactSchema;
