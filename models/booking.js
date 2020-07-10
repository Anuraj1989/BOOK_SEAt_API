const mongoose = require("mongoose");

const Boookingschema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "email is required"],
  },
  seatuniqueid: {
    type: String,
    require: [true, "setid is required"],
  },
  datefrom: {
    type: Date,
    require: [true, "booking from date is required"],
  },
  dateto: {
    type: Date,
    require: [true, "booking to date is required"],
  },
  datearray: {
    type: Array,
    default: [Date],
  },
  seat: {
    type: mongoose.Schema.ObjectId,
    ref: "seats",
    require: true,
  },
});

module.exports = mongoose.model("bookings", Boookingschema);
