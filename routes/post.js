const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const {getPost,createPost,postsByUser,postById,isPoster,deletePost}=require('../controllers/post');
const {requireSignin}=require('../controllers/auth');
const {userById} = require('../controllers/user');

const {createPostValidator}=require('../validator/index')


router.post('/post/new/:userId',requireSignin,createPost,createPostValidator);

router.get("/posts/by/:userId",requireSignin,postsByUser);
router.get('/',getPost);//this particular route can be accessed if and only if we have the required JWT that contains the secret key 
router.delete('/post/:postId',requireSignin,isPoster,deletePost);//so here the user who is trying to delete the post should be logged in and should be the same person who created the post and then we call deletpost 

//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.param("userId",userById);


router.param("postId",postById);//so when ever the request url contains the id of the post then we get the id and call the postById method which will create this req.post=post(that we got from the particular id)

module.exports = router;
