const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const {userById,allUsers} = require('../controllers/user');


router.get('/users',allUsers);

//so from the user.js from the controllers we are getting the userById function and that will be executed when the request url has the userId parameter
router.param('userId',userById);

module.exports = router;
 