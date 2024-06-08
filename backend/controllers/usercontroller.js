const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, role, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }
  const user = await User.create({
    username,
    email,
    role,
    password,
    confirmPassword,
  });
  console.log(`user created ${user}`);
  if (user) {
    res.status(201).json({
      status: "Success",
      data: {
        user: user,
      },
    });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email }).select("+password");
  //compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        //payload
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600m" }
    );
    res.status(200).json({
      status: "success",
      accessToken,
    });
  } else {
    res.status(401);
    throw new error("email or password is not valid");
  }
});

//@desc Current user info
//@route GET api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const restrict = (role) => {
  return asyncHandler(async (req, res) => {
    console.log(req.user.role);
    if (req.user.role === role) {
      next();
    }
    res.status(403);
    throw new error("You do not have the permission to perform this action");
  });
};
module.exports = { registerUser, loginUser, currentUser, restrict };
