//imports
const seats = require("../models/seats");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../utils/geocoder");
//functions

//---------------------------------------------------------------------
//@desc     get all seats
//@route    GET /api/v1/seats
//access    public

exports.getallseats = asyncHandler(async (req, res, next) => {
  //const allseats = await seats.find();
  let query;
  let querystr = JSON.stringify(req.query);

  // getting query from req
  querystr = querystr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  console.log(querystr);
  query = seats.find(JSON.parse(querystr)).populate("booking");

  const allseats = await query;
  res
    .status(200)
    .json({ status: true, count: allseats.length, data: allseats });
});

///--------------------------------------------------------------------
//@desc     get single seat for id
//@route    GET /api/v1/seats/:id
//access    public

exports.getseat = asyncHandler(async (req, res, next) => {
  const seat = await seats.findById(req.params.id);

  if (!seat) {
    return next(
      new errorRespose(`seat not found for id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: seat,
  });
});

///--------------------------------------------------------------------
//@desc     get single seat for id
//@route    GET /api/v1/seats/:id
//access    public

exports.getseat = asyncHandler(async (req, res, next) => {
  const seat = await seats.findById(req.params.id);
  if (!seat) {
    return next(
      new errorRespose(`seat not found for id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: seat,
  });
});
//-----------------------------------------------------------------
//@desc     create seat
//@route    POST /api/v1/seats
//access    private

exports.createSeat = asyncHandler(async (req, res, next) => {
  const seat = await seats.create(req.body);
  res.status(201).json({
    success: true,
    data: seat,
  });
});

//-----------------------------------------------------------------------------------
//@desc     update seat
//@route    PUT /api/v1/seats/:id
//access    private
exports.updateSeat = asyncHandler(async (req, res, next) => {
  //try {
  const seat = await seats.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!seat) {
    return next(
      new errorRespose(`seat not found for id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: seat,
  });
});

//-----------------------------------------------------------------------------
//@desc     delete seat
//@route    DELETE /api/v1/seats/:id
//access    private
exports.deleteSeat = asyncHandler(async (req, res, next) => {
  // try {
  //const seat = await seats.findByIdAndDelete(req.params.id); findByIdAndDelete will not work with cascade remove booking
  const seat = await seats.findById(req.params.id);
  if (!seat) {
    return next(
      new errorRespose(`seat not found for id ${req.params.id}`, 404)
    );
  }
  seat.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

//-----------------------------------------------------------------------------
//@desc     Get seats by post code and distance
//@route    GET /api/v1/seats/radius/:zipcode/:distance
//access    private
exports.getSeatsInradius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //get latitide and longitude from geocode for post code given

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  console.log(loc, lat, lon);

  //earith radious google
  const radius = distance / 3963;

  const seatmatched = await seats.find({
    geolocation: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  console.log(seatmatched);

  res.status(200).json({
    success: true,
    count: seatmatched.length,
    data: seatmatched,
  });
});
