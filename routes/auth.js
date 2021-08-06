const express = require("express");
const { signup, signin, signout,forgotPassword, resetPassword ,socialLogin} = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator ,passwordResetValidator } = require("../validator");

const router = express.Router();
// password forgot and reset routes
router.post("/social-login", socialLogin); //we will create a new user and perform login
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
