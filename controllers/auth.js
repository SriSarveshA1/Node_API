const jwt = require("jsonwebtoken");
require("dotenv").config();//to work with env files and the variables we created in the .env file
const expressJwt = require("express-jwt");//the expressJwt will be used to protect routes
const User = require("../models/user");//we have imported the user model from using which we can create a new user or sign up
const _ = require("lodash");
const { sendEmail } = require("../helpers");

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
         //so if the user exists then we proceed further or if the user is not found or any error we return 400 status and the response 
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signup."
            });
        }
           //if the email id of the user exists then we do the authentication perpose where we check the entered password(which will be converted to hashed_password ) and checked with the hashed password that is stored.
        if (!user.authenticate(password)) {
            //we get the password and convert to hashed_password and if they dont match then we return the 400 status and response with
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }
        //if the authentication is successfull ,we generate the token with user id and the secret key
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        // persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        // retrun response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Signout success!" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET, //if the token(which is made up of user id and the secret key) sended by the user is matched with the secret present then the user is verified and that time the jwtExpress appends the auth to the request object
    //below code is step 2 of authorization of a particular user based on the user id
    algorithms: ['HS256'],
    userProperty: "auth"//this is a property that says the user is authenticated already and this is an property now
});

exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ message: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ message: "No Email in request body" });

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${
                process.env.CLIENT_URL
            }/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${
                process.env.CLIENT_URL
            }/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};

exports.socialLogin = (req, res) => {
    // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            // create a new user and login
            user = new User(req.body);
            req.profile = user;
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        } else {
            // update existing user with new social info and login
            req.profile = user;
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                process.env.JWT_SECRET
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
    });
};
