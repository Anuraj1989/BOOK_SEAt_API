const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

console.log(
  new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
);

console.log(trim(Date(Date.now())));
