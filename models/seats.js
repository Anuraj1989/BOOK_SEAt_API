const mongoose = require("mongoose");
//load slugify to create slug for user friendly URLs
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const booking = require("./booking");

const Seatschema = mongoose.Schema(
  {
    seatid: {
      type: String,
      required: [true, "Please provide seat number"],
      trim: true,
      maxlength: [20, "Floor number can not be more than 20 characters"],
    },
    slug: String,

    floorid: {
      type: String,
      required: [true, "Please provide floor number"],
      trim: true,
      maxlength: [20, "floor number can not be more than 20 characters"],
    },
    officeid: {
      type: String,
      required: [true, "Please officeid"],
      trim: true,
      maxlength: [20, "officeid can not be more than 20"],
    },

    seatuniqueid: {
      type: String,
    },

    officelocation: {
      type: String,
      required: [true, "Please provide location"],
      trim: true,
      maxlength: [20, "location can not be more than 20"],
    },

    departement: {
      // Array of strings
      type: [String],
      required: true,
      enum: ["IT Service", "Customer Care", "Finance", "Business", "Other"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },

    geolocation: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },

      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
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

//geocode nad create location data from address

Seatschema.pre("save", async function (next) {
  console.log("inside geocoder");
  const loc = await geocoder.geocode(this.address);
  console.log(loc);
  this.geolocation = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].street,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
});

//slug for seat number

Seatschema.pre("save", function (next) {
  console.log("Slug ran", this.seatid);
  this.slug = slugify(this.seatid, { lower: true });
  next();
});

//slug for seatuniqueid

Seatschema.pre("save", function (next) {
  this.seatuniqueid = this.officeid + this.floorid + this.seatid;
  console.log("inside unique");
  next();
});

//do not save address as above captured
//  this.address = undefined;
//next();

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
