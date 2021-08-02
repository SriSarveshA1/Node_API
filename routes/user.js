const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();//express.Router() is a class and the variable router is an object that

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);//to retrive a single user and send his profile as a response
//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.put("/user/:userId", requireSignin, updateUser);//To update the profile we use put method that updates the user profile with the new content in the request body 
router.delete("/user/:userId", requireSignin, deleteUser);// we use this delete method of http request to delete the user

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
