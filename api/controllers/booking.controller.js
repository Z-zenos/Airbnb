const catchErrorAsync = require("../utils/catchErrorAsync");
const factory = require('./handlerFactory');
const Place = require('../models/place.model');
const User = require("../models/user.model");
const Booking = require("../models/booking.model");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

exports.getCheckoutSession = catchErrorAsync(async (req, res, next) => {
  // 1. Get currently booked place
  const place = await Place.findById(req.params.place_id);
  const { checkin, checkout, guests } = req.body;

  const datediff = (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24) + 1;

  let airbnbServiceFee = 1;
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
          images: [place.image_cover],
        },
        unit_amount: Math.trunc(place.price * datediff * (1 - place.price_discount) + airbnbServiceFee) * 100,
      },
      quantity: 1,
    }],

    /*
      If provided, this value will be used when the Customer object is created. If 
      not provided, customers will be asked to enter their email address. Use this 
      parameter to prefill customer data if you already have an email on file. To 
      access information about the customer once a session is complete, use the 
      customer field.
    */
    customer_email: req.user.email,

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

const createBookingCheckout = async (session) => {
  console.log(session);
  const place = session.client_reference_id;
  const user = (await User.findOne({
    email: session.customer_email
  }));

  const price = session.amount_total;
  // const discount = ;

  // const guests = ;
  // const adults = ;
  // const children = ;
  // const pets = ;
  // const checkin = ;
  // const checkout = ;
  // const phone = ;


  console.log(place, user, price);
  // await Booking.create({
  //   place, user, price
  // });
}

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