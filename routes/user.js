const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const {userById,allUsers,getUser} = require('../controllers/user');
const {requireSignin}=require('../controllers/auth');


router.get('/users',allUsers);
router.get('/user/:userId',requireSignin,getUser);//to retrive a single user and send his profile as a response
//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.param('userId',userById);

module.exports = router;
 