const asyncHandler = require("../middleware/asyncHandler");

exports.getazure = asyncHandler(async (req, res, next) => {
  res.status(200).json({ status: true, data: "I am from azume pipeline" });
});
