const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
//Load environment variables
dotenv.config({ path: "./config/config.env" });
//load error handler method to catch next() errors
const errorHandler = require("./middleware/error");
//logger
const logger = require("./middleware/logger");

//COnnect to DB
connectDB();

//Load route files
const manageseats = require("./routes/manageseats");
const auth = require("./routes/auth");
const bookings = require("./routes/booking");

const app = express();

//pass through cors middleware for cross origin resource sharing

app.use(cors());

//pass to loger middleware to print URLs

app.use(logger);

//Boday parser to get data from req
app.use(express.json());

// pass the request for cookie parser to middleware
app.use(cookieParser());

//mount router
app.use("/api/v1/seats", manageseats);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);

//Attach the requests to customer error handler to catch all errors
app.use(errorHandler);

/* console.log("process.env.PORT");

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
}); */

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server runnning in ${process.env.NODE_ENV} mode on port ${PORT} `.yellow
      .bold
  )
);

//Handle unhandlled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`error:${err.message}`.red);
  //close server and exit process
  server.close(() => process.exit(1));
});
