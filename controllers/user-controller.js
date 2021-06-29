  
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");


const HttpError = require("../utils/http-error");

// User SignUp----------------------------------------------------------------
const userSignup = async (req, res, next) => {
  //  console.log(req.body);                                                    
  const { firstName, lastName, email, password, dob} = req.body;

  // Existing user
  // console.log(firstName);
  // console.log(lastName);
  // console.log(email);
  // console.log(password);
  // console.log(dob);

  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed, please try later", 501);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("Email already in use", 502);
    return next(error);
  }

  // Encrypt password
  let hashedPasswaord;
  try {
    hashedPasswaord = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Password encryption failed", 503);
    return next(error);
  }

  // User Create
  const createdUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPasswaord,
    dob: dob,
    role: 'User'
  });

  try {
    await createdUser.save();
   

  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed", 504);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userPass: createdUser.password,
        email: createdUser.email,
        dob: createdUser.dob
      },
      "userSecretKey",
      { expiresIn: "2h" }
    );

    // console.log(token);
  } catch (err) {
    const error = new HttpError("Login Failed, Please try later", 505);
    return next(error);
  }

  return res.json({firstName: createdUser.firstName, lastName: createdUser.lastName, email: createdUser.email, dob: createdUser.dob,token: token});
};


// User Login ----------------------------------------------------------------
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
    });
    
  } catch (err) {
    const error = new HttpError("Login failed, Please try later", 506);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid Credentials, Please try later", 507);
    return next(error);
  }

  let isValidPassword = false;
  try {
    
    isValidPassword = await bcrypt.compare(password, existingUser.password);
                                             
  } catch (err) {
    const error = new HttpError("Invalid Credentials, Please try later", 508);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid Credentials, Please try later", 509);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        dob: existingUser.dob
      },
      "userSecretKey",
      { expiresIn: "2h" }
    );

    
  } catch (err) {
    const error = new HttpError("Login Failed, Please try later", 510);
    return next(error);
  }

  res.status(200).json({
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      dob: existingUser.dob,
      token: token
  });
};


// Get User----------------------------------------------------------------
const getUser = async (req, res, next) => {
  
  let user;
  try {
    user = await User.find();
    return res.json( user );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Get User failed, please try later", 511);
    return next(error);
  }
  
};



exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.getUser = getUser;
