const User=require('../models/user');//we have imported the user model from using which we can create a new user or sign up
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt');//the expressJwt will be used to protect routes
require('dotenv').config();//to work with env files and the variables we created in the .env file

const signup= async (req, res) => //we are making this function as asynchronous so that inside the function if there is await keyword the below code will be blocked.
{
  const userExists = await User.findOne({email: req.body.email});//so until we find the user exists or not below code is not executed.
  //we are checking whether a user is already registered or not by checking is mail id is already is stored 
  if(userExists)
  {
      //so if the particular user already exists we just send a error back 
    return  res.status(403).json({
          error:"Email already exists"
      });
  }
  //so if the user is not exists before and the email id is not used before we create a new user
  const user= await new User(req.body);//we pass the req.body object as a parameter
  await user.save();//so until ther user is saved the code after this is blocked 
  //so before saving the validation before saving is done by the validator that will be called before the user signup function is called
  res.status(200).json({messsage:"Signup is successfull"});//we send the response back with the user that we created.


}
const signin=(req,res)=>{
  const {email,password}=req.body;
  //we are using the callback function that checks the respected email is stored in the database and if yes then the call back function is called
  //the call back function that we wrote bellow contains two arguments err which contains the error object if there is any error occured and there is a user ,which contains the user object if the finding is successful
  User.findOne({email},(err,user)=>{
    //so if the user exists then we proceed further or if the user is not found or any error we return 400 status and the response 
    if(err||!user)
    {
      return res.status(400).json({
        error:"User with the email does not exist,please signin"
      })
    }
    //if the email id of the user exists then we do the authentication perpose where we check the entered password(which will be converted to hashed_password ) and checked with the hashed password that is stored.
    if(!user.authenticate(password))
    {
      //we get the password and convert to hashed_password and if they dont match then we return the 400 status and response with
      return res.status(400).json({
        error:"Entered email and password is incorrect"
      })
    }
    //if the authentication is successfull ,we generate the token with user id and the secret key
    const token =jwt.sign({_id: user.id},process.env.JWT_SECRET);//This way we create the token
    
    //then we store the token in the cookie with expiry date
    res.cookie("t",token,{expire:new Date()+99999}); //inside the cookie we store the token as "t" with the expiry date along with it

    //return response with the user and token to frontend client and we will store the token in the browsers local storage
    const {_id,name,email} =user;
    return res.json({token,user:{_id,name,email}}); // we send the whole object that consists of token and the user object inside which we have _id,name,email

  });
  }

  const signout=(req,res)=>{
   res.clearCookie("t");//we stored the token as t so we are clearing that particular token from the responce cookie
   return res.json({message:"Signout successful"});//after clearing it we just send the response
  }

const requireSignin=expressJwt({
  secret:process.env.JWT_SECRET,
  algorithms: ['HS256']
});


module.exports={signup,signin,signout,requireSignin};
  