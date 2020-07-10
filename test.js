const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

let newBookingStart = value.getTime();

console.log(newBookingStart);
console.log(trim(Date(Date.now())));
