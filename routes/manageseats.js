const express = require("express");
//const router = express.Router();

//exports controller methods

const {
  getallseats,
  getseat,
  createSeat,
  updateSeat,
  deleteSeat,
  getSeatsInradius,
} = require("../controllers/manageseats");

//include other resource routers

const bookingRouter = require("./booking");

const router = express.Router();

// reroute into other resource routers

router.use("/:seatid/bookings", bookingRouter);

router.route("/").get(getallseats).post(createSeat);
router.route("/:id").get(getseat).put(updateSeat).delete(deleteSeat);

router.route("/radius/:zipcode/:distance").get(getSeatsInradius);

module.exports = router;
