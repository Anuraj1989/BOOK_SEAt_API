const fs = require("fs");
const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");

//load environment variables

dotenv.config({ path: "./config/config.env" });

//model

const seats = require("./models/seats");

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

//load to DB

const importSeat = async () => {
  try {
    await seats.create(allseats);
    console.log(`data imported...`.red);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteSeats = async () => {
  try {
    await seats.deleteMany();
    console.log("deleted all".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importSeat();
} else if (process.argv[2] === "-d") {
  deleteSeats();
}
