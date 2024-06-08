const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your name: "],
    },
    email: {
      type: String,
      required: [true, "Please enter your email: "],
      unique: [true, "Email address already taken"],
      lowercase: true,
      validate: [validator.isEmail, "please enter a valid email"],
    },
    role: {
      type: String,
      enum: ["admin", "faculty", "Student"],
      default: "Student",
    },
    password: {
      type: String,
      required: [true, "Please add the user password: "],
      minlenght: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password: "],
      validate: {
        validator: function (val) {
          return val == this.password;
        },
        message: "Password mismatch",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  this.confirmPassword = undefined;
  next();
});

module.exports = mongoose.model("User", userSchema);
