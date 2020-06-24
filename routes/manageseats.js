const express = require("express");
const router = express.Router();

//exports controller methods

const {
  getallseats,
  getseat,
  createSeat,
  updateSeat,
  deleteSeat,
  getSeatsInradius,
} = require("../controllers/manageseats");

router.route("/").get(getallseats).post(createSeat);
router.route("/:id").get(getseat).put(updateSeat).delete(deleteSeat);

router.route("/radius/:zipcode/:distance").get(getSeatsInradius);

module.exports = router;
