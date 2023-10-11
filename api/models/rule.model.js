const mongoose = require('mongoose');

const cancellation_policies = [
  {
    id: 1,
    name: 'Flexible',
    description: "Full refund 1 day prior to arrival",
  },
  {
    id: 2,
    name: 'Flexible or Non-refundable',
    description: "In addition to Flexible, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.",
  },
  {
    id: 3,
    name: 'Moderate',
    description: "Full refund 5 days prior to arrival",
  },
  {
    id: 4,
    name: 'Moderate or Non-refundable',
    description: "In addition to Moderate, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel.",
  },
  {
    id: 5,
    name: 'Firm',
    description: "Full refund for cancellations up to 30 days before check-in. If booked fewer than 30 days before check-in, full refund for cancellations made within 48 hours of booking and at least 14 days before check-in. After that, 50% refund up to 7 days before check-in. No refund after that.",
  },
  {
    id: 6,
    name: 'Strict',
    description: "Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made at least 7 days before check-in. No refunds for cancellations made within 7 days of check-in.",
  },
  {
    id: 7,
    name: "Strict or Non-refundable",
    description: "In addition to Strict, offer a non-refundable option—guests pay 10% less, but you keep your payout no matter when they cancel."
  }
];

const cancellationPoliciesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String
});

const ruleSchema = new mongoose.Schema(
  {
    cancellation_policy: {
      type: cancellationPoliciesSchema,
      default: cancellation_policies[0]
    },
    additional_rules:                           { type: String, default: '' },
    commercial_photography_and_filming_allowed: { type: Boolean, default: false},
    smoking_allowed:                            { type: Boolean, default: false},
    events_allowed:                             { type: Boolean, default: false},
    pets_allowed:                               { type: Boolean, default: false},

  }
);

module.exports = ruleSchema;