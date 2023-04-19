const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsyncErrors = require("../utils/catchAsyncError");

module.exports.register = catchAsyncErrors(async (req, res, next) => {
  const user = new UserModel(req.body);
  await user.save();
  const accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
  res.json({
    success: true,
    message: "user register success",
    user: {
      name: user.name,
      email: user.email,
      token: accessToken,
    },
  });
});
module.exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(500).json({ success: false, message: "there is no user in this email" });
  }
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return res.status(500).json({ success: false, message: "your entire email or password is invalid" });
  }
  const accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
  res.json({
    success: true,
    message: "user login success",
    user: {
      name: user.name,
      email: user.email,
      token: accessToken,
    },
  });
});

module.exports.getMe = catchAsyncErrors(async (req, res, next) => res.send(req.user));
