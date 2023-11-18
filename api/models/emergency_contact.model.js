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
      // match: [/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im, "Please provide valid your phone number"]
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
