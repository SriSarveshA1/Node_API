const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const postController=require('../controllers/post');
const {requireSignin}=require('../controllers/auth');
const validator=require('../validator/index')

router.get('/getPosts',requireSignin,postController.getPost);//this particular route can be accessed if and only if we have the required JWT that contains the secret key 
router.post('/post',validator.createPostValidator,postController.createPost);
module.exports = router;
