const express = require('express');
const bookingController = require('../controllers/booking.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

// This route will not follow the REST principle because this is not really gonna be about creating or getting or updating any booking. Instead this route will only be for the client to get a checkout session.
router.post(
  '/checkout-session/:place_id', // we want client to send along the id of the place that is currently begin booked. And we can fill up the checkout session with all the data that is necessary such as place name and place price...
  bookingController.getCheckoutSession
);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route(':/id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking)

module.exports = router;