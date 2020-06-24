const mongoose = require("mongoose");
//load slugify to create slug for user friendly URLs
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const Seatschema = mongoose.Schema({
  seatno: {
    type: String,
    required: [true, "Please provide seat number"],
    trim: true,
    maxlength: [20, "Floor number can not be more than 20 characters"],
  },
  slug: String,

  floorno: {
    type: String,
    required: [true, "Please provide floor number"],
    trim: true,
    maxlength: [20, "floor number can not be more than 20 characters"],
  },

  officelocation: {
    type: String,
    required: [true, "Please provide location"],
    trim: true,
    maxlength: [20, "location can not be more than 20"],
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
});

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
  console.log("Slug ran", this.seatno);
  this.slug = slugify(this.seatno, { lower: true });
  next();

  //do not save address as above captured
  //  this.address = undefined;
  //next();
});

module.exports = mongoose.model("seats", Seatschema);
