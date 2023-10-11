const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema(
  {
    view_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true
    }
  }
);

const View = mongoose.model('View', viewSchema);

module.exports = View;