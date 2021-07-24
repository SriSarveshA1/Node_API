const express=require('express');
const router=express.Router();//express.Router() is a class and the variable router is an object that
const AuthSignup=require('../controllers/auth');
const validator=require('../validator/index')


router.post('/signup',AuthSignup.signup);
module.exports = router;
