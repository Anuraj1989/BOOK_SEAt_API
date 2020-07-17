const mongoose = require("mongoose");
//load slugify to create slug for user friendly URLs
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const booking = require("./booking");

const Seatschema = mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "Please provide city"],
      trim: true,
      maxlength: [20, "city can not be more than 20 characters"],
    },

    site: {
      type: String,
      required: [true, "Please site name"],
      trim: true,
      maxlength: [20, "site can not be more than 20 characters"],
    },
    locationid: {
      type: String,
      required: [true, "Please provide locationid"],
      trim: true,
      maxlength: [20, "locationid can not be more than 20"],
    },
    phase: {
      type: String,
      required: [true, "Please provide phase"],
      trim: true,
      maxlength: [20, "phase can not be more than 20"],
    },
    floor: {
      type: String,
      required: [true, "floor provide phase"],
      trim: true,
      maxlength: [20, "floor can not be more than 20"],
    },
    seatno: {
      type: String,
      required: [true, "seat no provide phase"],
      trim: true,
      maxlength: [20, "seat no can not be more than 20"],
    },

    seatuniqueid: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
Seatschema.pre("save", function (next) {
  this.seatuniqueid = this.locationid + this.phase + this.floor + this.seatno;
  console.log("inside unique");
  next();
});

//cascade delete booking when a seat is deleted
Seatschema.pre("remove", async function (next) {
  console.log(`booking being removed from seats ${this._id}`);
  await this.model("bookings").deleteMany({ seat: this._id });
});

//Reverse populate virtuals i.e here poulate virtual booking for seats

Seatschema.virtual("booking", {
  ref: "bookings",
  localField: "_id",
  foreignField: "seat",
  justOne: false,
});

module.exports = mongoose.model("seats", Seatschema);
