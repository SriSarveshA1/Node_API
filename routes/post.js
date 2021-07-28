const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const {getPost,createPost}=require('../controllers/post');
const {requireSignin}=require('../controllers/auth');
const {userById} = require('../controllers/user');

const {createPostValidator}=require('../validator/index')


router.post('/post/new/:userId',requireSignin,createPost,createPostValidator);
router.get('/',getPost);//this particular route can be accessed if and only if we have the required JWT that contains the secret key 

//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.param("userId",userById);

module.exports = router;
