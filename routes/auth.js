const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const AuthSignup=require('../controllers/auth');
const {createSignUpValidator}=require('../validator/index');
const {userById} = require('../controllers/user');


router.post('/signup',createSignUpValidator,AuthSignup.signup);
router.post('/signin',AuthSignup.signin);
router.get('/signout',AuthSignup.signout);

//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.param('userId',userById);

module.exports = router;
 