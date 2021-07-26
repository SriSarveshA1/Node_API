const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const AuthSignup=require('../controllers/auth');
const {createSignUpValidator}=require('../validator/index')


router.post('/signup',createSignUpValidator,AuthSignup.signup);
router.post('/signin',AuthSignup.signin);
module.exports = router;
 