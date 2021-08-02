const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validator");

const router = express.Router();//express.Router() is a class and the variable router is an object that

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route containing :userId, our app will first execute userByID()
//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.param("userId", userById);

module.exports = router;
