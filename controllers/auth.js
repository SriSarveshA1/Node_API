const jwt = require("jsonwebtoken");
require("dotenv").config();//to work with env files and the variables we created in the .env file
const expressJwt = require("express-jwt");//the expressJwt will be used to protect routes
const User = require("../models/user");//we have imported the user model from using which we can create a new user or sign up

exports.signup = async (req, res) => {//we are making this function as asynchronous so that inside the function if there is await keyword the below code will be blocked.
    const userExists = await User.findOne({ email: req.body.email });//so until we find the user exists or not below code is not executed.
    //we are checking whether a user is already registered or not by checking is mail id is already is stored 
    if (userExists){
      //so if the particular user already exists we just send a error back 
        return res.status(403).json({
            error: "Email is taken!"
        });
    }
     //so if the user is not exists before and the email id is not used before we create a new user
    const user = await new User(req.body);//we pass the req.body object as a parameter
    await user.save();//so until ther user is saved the code after this is blocked
    //so before saving the validation before saving is done by the validator that will be called before the user signup function is called
    res.status(200).json({ message: "Signup success! Please login." });//we send the response back with the user that we created.
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
      //we are using the callback function that checks the respected email is stored in the database and if yes then the call back function is called
  //the call back function that we wrote bellow contains two arguments err which contains the error object if there is any error occured and there is a user ,which contains the user object if the finding is successful
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signup."
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }
        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        // retrun response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } });// we send the whole object that consists of token and the user object inside which we have _id,name,email
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");//we stored the token as t so we are clearing that particular token from the responce cookie
    return res.json({ message: "Signout success!" });//after clearing it we just send the response
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    //if the token(which is made up of user id and the secret key) sended by the user is matched with the secret present then the user is verified and that time the jwtExpress appends the auth to the request object
     //below code is step 2 of authorization of a particular user based on the user id
    userProperty: "auth"//this is a property that says the user is authenticated already and this is an property now
});
    