const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const postController=require('../controllers/post');

router.get('/',postController.getPost);
router.post('/post',postController.createPost);
module.exports = router;
