const logger = (req, res, next) => {
  console.log("hello log me");
  next();
};

module.exports = logger;
