const fs = require("fs");
const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");

//load environment variables

dotenv.config({ path: "./config/config.env" });

//model

const seats = require("./models/seats");
const bookings = require("./models/booking");

//connect to DB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

//read json

console.log(`${__dirname}`);

const allseats = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/seats.json`, "utf-8")
);
console.log(allseats);

const allbooking = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/booking.json`, "utf-8")
);
console.log(allbooking);

//load to DB

const importSeat = async () => {
  try {
    await seats.create(allseats);
    console.log(`seat data imported...`.red);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const importbookings = async () => {
  try {
    await bookings.create(allbooking);
    console.log(`booking data imported...`.red);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteSeats = async () => {
  try {
    await seats.deleteMany();
    console.log("deleted all seats".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deletebooking = async () => {
  try {
    await bookings.deleteMany();
    console.log("deleted all bookings".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-is") {
  importSeat();
} else if (process.argv[2] === "-ds") {
  deleteSeats();
} else if (process.argv[2] === "-ib") {
  importbookings();
} else if (process.argv[2] === "-db") {
  deletebooking();
}
