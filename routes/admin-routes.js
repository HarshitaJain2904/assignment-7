const express = require('express');

// Self created functions/files/classes
const adminController = require('../controllers/admin-controller');
const checkAuth = require('../middlewares/check-auth');

const router = express.Router();


// Unauthenticated
router.post("/signup",  adminController.adminSignup);
router.post("/login", adminController.adminLogin);

//Midleware to check authentication
router.use(checkAuth);


module.exports = router;