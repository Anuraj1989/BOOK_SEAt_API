const mongoose = require("mongoose");

const Boookingschema = mongoose.Schema({
  userid: {
    type: String,
  },
  seatuniqueid: {
    type: String,
  },
  datefrom: {
    type: Date,
    require: [true, "booking from date is required"],
  },
  dateto: {
    type: Date,
    require: [true, "booking to date is required"],
  },
  seat: {
    type: mongoose.Schema.ObjectId,
    ref: "seats",
    require: true,
  },
});

module.exports = mongoose.model("bookings", Boookingschema);
