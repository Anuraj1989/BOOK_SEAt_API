//custom error handler for all errors from controller modules

const errorResponse = require("../utils/errorResponse");

const errrorHandler = (err, req, res, next) => {
  ///create a copy of err
  let error = { ...err };
  error.message = err.message;

  //log to cosole to see err parameters
  console.log(err.stack.red);
  console.log(err.name);
  console.log(err);

  //mongoose invalid object or idetifier error

  if (err.name === "CastError") {
    const message = `seat not found for id ${err.value}`;
    console.log(`seat not found for id ${err.value}`);
    error = new errorResponse(message, 404);
  }

  //mongoose duplicate key

  if (err.code === 11000) {
    const message = "Duplicate filed value entered";
    error = new errorResponse(message, 400);
  }

  //Mongoose validation error

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    data: error.message || 500,
  });
};

module.exports = errrorHandler;
