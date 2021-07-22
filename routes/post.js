const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const postController=require('../controllers/post');
const validator=require('../validator/index')

router.get('/get',postController.getPost);
router.post('/post',validator.createPostValidator,postController.createPost);
module.exports = router;
