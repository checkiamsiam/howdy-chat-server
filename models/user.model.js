const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "must be require"],
      trim: true,
      minLength: [3, "it must be between 3 to 30 characters"],
      maxLength: [30, "it must be between 3 to 30 characters"],
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "provide a valid email"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "password must be 8 character"],
    },
    avatar: {
      type: String,
      required: true,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    IP_address: String,
    last_login: Date,
    last_seen: Date,
    device: String,
    browser: String,
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
