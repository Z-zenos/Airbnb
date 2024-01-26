const mongoose = require("mongoose");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const catchErrorAsync = require("../utils/catchErrorAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory');
const Place = require('../models/place.model');
const User = require("../models/user.model");
const Booking = require("../models/booking.model");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

exports.getCheckoutSession = catchErrorAsync(async (req, res, next) => {
  // 1. Get currently booked place
  const place = await Place.findById(req.params.place_id);
  const { checkin, checkout, guests, hasMessage, hasPhone } = req.body;

  const datediff = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24) + 1;

  let airbnbServiceFee = 1;

  const custom_fields = [];
  if (hasPhone)
    custom_fields.push({
      key: 'phone',
      label: {
        custom: 'Phone number',
        type: 'custom'
      },
      type: 'text',
      optional: true,
      text: {
        maximum_length: 20
      }
    });

  if (hasMessage)
    custom_fields.push({
      key: 'message',
      label: {
        custom: 'Message for host',
        type: 'custom',
      },
      type: 'text',
      optional: true,
      text: {
        maximum_length: 255
      }
    });

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    /*
      A list of items the customer is purchasing. Use this parameter to pass one-time 
      or recurring Prices.
      For payment mode, there is a maximum of 100 line items, however it is 
      recommended to consolidate line items if there are more than a few dozen.
    */
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: place.name,
          description: place.description,
          images: [place.images[0]],
        },
        unit_amount: Math.trunc(place.price * datediff * (1 - (place.price_discount ? place.price_discount : 0)) + airbnbServiceFee) * 100,
      },
      quantity: 1,
    }],

    /*
      Collect additional information from your customer using custom fields. Up to 2 
      fields are supported.
    */
    custom_fields,

    /*
      If provided, this value will be used when the Customer object is created. If 
      not provided, customers will be asked to enter their email address. Use this 
      parameter to prefill customer data if you already have an email on file. To 
      access information about the customer once a session is complete, use the 
      customer field.
    */
    customer_email: req.user.email,

    /*
      Set of key-value pairs that you can attach to an object. This can be useful for 
      storing additional information about the object in a structured format. 
      Individual keys can be unset by posting an empty value to them. All keys can be 
      unset by posting an empty value to metadata.
    */
    metadata: {
      checkin,
      checkout,
      guests: JSON.stringify(guests),
      place_id: place?.id
    },

    /*
      A unique string to reference the Checkout Session. This can be a customer ID, a 
      cart ID, or similar, and can be used to reconcile the session with your 
      internal systems.
    */
    client_reference_id: `${req.user.id}${req.params.place_id}${Date.now()}`,

    mode: 'payment',
    ui_mode: 'embedded',

    /*
      The URL to redirect your customer back to after they authenticate or cancel 
      their payment on the payment method’s app or site. This parameter is required 
      if ui_mode is embedded and redirect-based payment methods are enabled on the 
      session.
    */
    return_url: `${req.headers.origin}/booking/result`,
  });

  // 3. Create session as response and send it back to client
  res.status(200).json({
    status: 'success',
    clientSecret: session.client_secret
  });
});

const createBookingCheckout = catchErrorAsync(async (session) => {
  const place = await Place.findById(session.metadata.place_id);

  if (!place)
    return next(new AppError("Place doesn't exist.", 403));

  const user = await User.findOne({
    email: session.customer_email
  });

  if (!user)
    return next(new AppError("User doesn't exist.", 403));

  const metadata = session.metadata;
  const guests = JSON.parse(metadata.guests);

  const phone = session.custom_fields
    .find(field => field.key === 'phone')
    ?.text?.value || "";

  const message = session.custom_fields
    .find(field => field.key === 'message')
    ?.text?.value || "";

  await Booking.create({
    place: new mongoose.Types.ObjectId(place?.id),
    user: new mongoose.Types.ObjectId(user?.id),
    price: session.amount_total / 100,
    guests: guests?.total,
    adults: guests?.adults || 1,
    children: guests?.children || 0,
    pets: guests?.pets || 0,
    discount: place.price_discount,
    checkin: new Date(+metadata.checkin),
    checkout: new Date(+metadata.checkout),
    message,
    phone,
  });
});

exports.webhookCheckout = catchErrorAsync(async (req, res, next) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({
    received: true
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);