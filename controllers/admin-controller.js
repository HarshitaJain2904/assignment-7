const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const HttpError = require('../utils/http-error');

const adminSignup = async (req,res,next) => {
 console.log(req.body);

    const {firstName ,lastName, email, password } = req.body;
  // Existing Admin
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(password);

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({
      email: email,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError(" Admin Signup failed, please try later", 601);
    return next(error);
  }
  if (existingAdmin) {
    const error = new HttpError("Email already in use",602 );
    return next(error);
  }
  // Encrypt password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 13);
  } catch (err) {
    const error = new HttpError("Password encryption failed", 603);
    return next(error);
  }
  // Admin Create
  const createdAdmin = new Admin({
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
    email: email,
    role: 'Admin'
  });

 
  try {
    await createdAdmin.save();
   
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed", 604);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        AdminPass: createdAdmin.password,
        email: createdAdmin.email,
      },
      "AdminSecretKey",
      { expiresIn: "2h" }
    );

    // console.log(token);
  } catch (err) {
    const error = new HttpError("Login Failed, Please try later", 605);
    return next(error);
  }

  
  return res.json({firstName: createdAdmin.firstName, lastName: createdAdmin.lastName, email: createdAdmin.email, token: token});

   
};

const adminLogin = async (req,res,next) => {
    const { email, password } = req.body;

    let existingAdmin;
    try {
      existingAdmin = await Admin.findOne({
        email: email,
      });
      
    } catch (err) {
      const error = new HttpError("Login failed, Please try later", 606);
      return next(error);
    }
  
    if (!existingAdmin) {
      const error = new HttpError("Invalid Credentials, Please try later", 607);
      return next(error);
    }
  
  
  
    let isValidPassword = false;
    try {
      //returns true when value matches
      isValidPassword = await bcrypt.compare(password, existingAdmin.password);
    
                                                 
    } catch (err) {
      const error = new HttpError("Invalid Credentials, Please try later", 608);
      return next(error);
    }
  
    if (!isValidPassword) {
      const error = new HttpError("Invalid Credentials, Please try later", 609);
      return next(error);
    }
  
    let token;
    try {
      token = jwt.sign(
        {
          adminId: existingAdmin.id,
          email: existingAdmin.email,
        },
        "userSecretKey",
        { expiresIn: "2h" }
      );
  
      // console.log(token);
    } catch (err) {
      const error = new HttpError("Login Failed, Please try later", 610);
      return next(error);
    }
  
    res.status(200).json({
      firstName: existingAdmin.firstname,
      lastName: existingAdmin.lastname,
      email: existingAdmin.email,
      token: token
    });
  
    
};

exports.adminSignup = adminSignup;
exports.adminLogin = adminLogin;