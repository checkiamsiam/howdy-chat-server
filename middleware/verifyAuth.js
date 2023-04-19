const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsyncErrors = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

const protect = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  // Verification token
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }

  // update user data
  currentUser.IP_address = req.ip;
  currentUser.last_seen = Date.now();
  currentUser.device = req.device.type;
  currentUser.browser = req.headers["user-agent"];
  currentUser.save();

  req.user = currentUser;

  next();
});

module.exports = protect;
