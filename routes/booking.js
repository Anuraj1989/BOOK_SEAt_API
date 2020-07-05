const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getBookings,
  getBooking,
  createBooking,
} = require("../controllers/booking");

router.route("/").get(getBookings).post(createBooking);
router.get("/:id", getBooking);

module.exports = router;
