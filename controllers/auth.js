const User=require('../models/user');//we have imported the user model from using which we can create a new user or sign up

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
module.exports={signup};
  