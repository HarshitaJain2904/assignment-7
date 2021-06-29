// Other libraries importing
const express = require('express');

// Self created functions/files/classes
const userController = require('../controllers/user-controller');
const checkAuth = require('../middlewares/check-auth');
const blogController =require('../controllers/blog-controller');


const router = express.Router();


// Unauthenticated
router.post("/signup",  userController.userSignup);
router.post("/login", userController.userLogin);



//Midleware to check authentication
router.use(checkAuth);

// Authenticated routes
router.get("/getInfo", userController.getUser);
router.post("/postblog", blogController.postBlog);
router.get("/getblog", blogController.getBlog);

module.exports = router; 