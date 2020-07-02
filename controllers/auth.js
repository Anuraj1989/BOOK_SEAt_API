const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const errorRespose = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

//---------------------------------------------------------------------
//@desc     Register user
//@route    POST /api/v1/auth/register
//access    public

exports.register = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, role } = req.body;
  //create user

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token: token });
});

//---------------------------------------------------------------------
//@desc     login user
//@route    POST /api/v1/auth/login
//access    public

exports.login = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  console.log("i am in login method");
  const { email, password } = req.body;

  //validate email and pwrd

  if (!email || !password) {
    return next(new errorRespose("Please provide email and passward", 400));
  }

  //check for user matching
  //.select is to get hashed passward also as we mentioned do not select in schema

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorRespose("Invalid credentials", 401));
  }

  //check if password maatched

  const ismatch = await user.matchPassword(password);

  if (!ismatch) {
    return next(new errorRespose("Invalid credentials", 401));
  }

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token: token });
});
