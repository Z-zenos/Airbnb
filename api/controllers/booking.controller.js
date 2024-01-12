const catchErrorAsync = require("../utils/catchErrorAsync");
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Place = require('../models/place.model');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = catchErrorAsync(async (req, res, next) => {
  // 1. Get currently booked place
  const place = await Place.findById(req.params.place_id);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: place.name,
        },
        unit_amount: place.price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `${req.protocol}://${req.get('host')}/booking/checkout/return?session_id={CHECKOUT_SESSION_ID}`
  });

  // 3. Create session as response and send it back to client
  res.status(200).json({
    status: 'success',
    clientSecret: session.client_secret
  });
});

exports.getSessionStatus = catchErrorAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.status(200).json({
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details.email
  });
});