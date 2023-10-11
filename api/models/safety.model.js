const mongoose = require('mongoose');

const safetySchema = new mongoose.Schema(
  {
    unsuitable_for_children:            { type: Boolean, default: false },
    unsuitable_for_infants:             { type: Boolean, default: false },
    pool_hot_tub_without_gate_or_lock:  { type: Boolean, default: false },
    nearby_lake_river:                  { type: Boolean, default: false },
    has_dangerous_animal:               { type: Boolean, default: false },
    security_cameras:                   { type: Boolean, default: false },
    carbon_monoxide_alarm:              { type: Boolean, default: false },
    smoke_alarm:                        { type: Boolean, default: false },
    pets_allowed:                       { type: Boolean, default: false },
    weapons_allowed:                    { type: Boolean, default: false },
    noise:                              { type: Boolean, default: false },
    no_parking:                         { type: Boolean, default: false },
  }
);

module.exports = safetySchema;
