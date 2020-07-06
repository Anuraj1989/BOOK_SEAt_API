//imports
const Booking = require("../models/booking");
const asyncHandler = require("../middleware/asyncHandler");
const Seats = require("../models/seats");
const errorResponse = require("../utils/errorResponse");

//functions

//---------------------------------------------------------------------
//@desc     get bookings
//@route    GET /api/v1/bookings
//          GET /api/v1/seats/:seatid/bookings
//access    public

exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;
  console.log(`get all bookings for the setid ${req.params.seatid}`);

  if (req.params.seatid) {
    query = Booking.find({ seatid: req.params.seatid });
  } else {
    //query = booking.find().populate("seat");  //of all fields are not required pass required as object to path
    query = Booking.find().populate({
      path: "seat",
      select: "seatid officeid floorid officelocation",
    });
  }

  const bookings = await query;

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

//---------------------------------------------------------------------
//@desc     get booking for an ID
//@route    GET /api/v1/booking
//access    public

exports.getBooking = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.findById(req.params.id).populate({
    path: "seat",
    select: "seatid officeid floorid officelocation",
  });

  if (!bookings) {
    return next(
      new errorResponse(`booking not found for the id ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

//---------------------------------------------------------------------
//@desc     create booking for a seat
//@route    POST /api/v1/seats/:id/bookings
//access    private

exports.createBooking = asyncHandler(async (req, res, next) => {
  //since seat is not an actual data in bookings chema we are setting as below
  req.body.seat = req.params.seatid;

  const seat = await Seats.findById(req.params.seatid);

  if (!seat) {
    return next(
      new errorResponse(`seat not found for the id ${req.params.seatid}`),
      404
    );
  }

  const newBooking = await Booking.create(req.body);

  res.status(200).json({
    success: true,
    data: newBooking,
  });
});

//---------------------------------------------------------------------
//@desc     update booking
//@route    PUT /api/v1/bookings/:id
//access    private

exports.updateBooking = asyncHandler(async (req, res, next) => {
  let bookingck = await Booking.findById(req.params.id);

  if (!bookingck) {
    return next(
      new errorResponse(`booking not found for the id ${req.params.id}`),
      404
    );
  }

  const booking1 = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: booking1,
  });
});

//---------------------------------------------------------------------
//@desc     delete booking
//@route    DELETE /api/v1/bookings/:id
//access    private

exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const bookingck = await Booking.findById(req.params.id);

  if (!bookingck) {
    return next(
      new errorResponse(`booking not found for the id ${req.params.id}`),
      404
    );
  }

  bookingck.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
