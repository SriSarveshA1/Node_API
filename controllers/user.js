const _ = require("lodash");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");

exports.userById = (req, res, next, id) => {
    //Here we are finding the user with respect to the id that we got from the request url
    //And while executing the retrival part of the userInfo based on id ..and the callback function will be containing the err , user object ..if the retrival is successful we get the user object or as a err.
    User.findById(id)
         //populate the following and followers users array
        .populate('following','_id name')
        .populate('followers','_id name')
        .exec((err, user) => {
        if (err || !user) {
            //if the user does not exist or if there is any error occured,
            return res.status(400).json({
                error: "User not found"
            });
        }
         //so if there is a user exists then we come here and append the user object to the new property called profile in the request object
        req.profile = user; // adds profile object in req with user info
        next();
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized =req.profile && req.auth && req.profile._id === req.auth._id;
     //               step 1       step 2    combnining both(step1 & step2)
      //In above statement gives true then the user who is requsting is authorized

    if (!authorized) {
        // if the user is not authorized
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
};

exports.allUsers = (req, res) => {
    //so here the find method is going to all the users that we created using signup method and it has a callback() that gets err,users object..if there is a error that occoured this err will have some value or users parameter gets all the users object
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        //if there is no error 
        res.json(users);
    }).select("name email updated created");//so we want to retrive these properties(name,email,updated,created) specifically 
};

exports.getUser = (req, res) => {
    //we are going to select a single user and return his profile
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);// we know that when a request url is made based on getting the particular user profile there will be userId in the url and we need to retrive the user object from the router.param('userId',UserById) here in the UserById method the req.profile=user will be attached
};



exports.updateUser=(req,res,next)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{//we parse the form data that takes the req data and in call back functions we are going to work with the fields and files
        if(err)
        {
            return res.status(400).json({
                error:"Photo could not be uploaded"
            })
        }
        //save user
        let user=req.profile;//so when the url has the user id then params will catch and userById method will be invoked and req.profile will contain the user object
        user=_.extend(user,fields);//so we are updating the data in the user object when we update the user
        user.updated=Date.now();//storing the current date
        if(files.photo)
        {
            //if there is a photo in the files is true we put it in the user object
            user.photo.data=fs.readFileSync(files.photo.path);
            user.photo.contentType=files.photo.type;
        }
        user.save((err,result)=>{
          if(err)
          {
              return res.status(400).json({
                  error:err
              })
          }
          user.hashed_password=undefined;
          user.salt=undefined;
          res.json(user);
        })
    })  
}

exports.userPhoto=(req,res,next)=>{//this is basically a middleware and after calling this fuction the control goes to some other part
    if(req.profile.photo.data){//so when there is a userId in the param the userById method will run and the user object is put it into the req.profile
     //if the req.profile has photo which means the user has already uploaded a profile image
      res.set("Content-Type",req.profile.photo.contentType);//we are setting the content type in the response we are going to send
      return res.send(req.profile.photo.data);//so we need to send the photo as the response
    }
    //if the photo is not uploaded in the profile 
    next();//we call the next() that will pass on the controller 
}

exports.deleteUser = (req, res, next) => {
    let user = req.profile;//so when the request url contains the userid then UserById method will be invoked before itself
    user.remove((err, user) => {
        if (err) {
            //if there is any error occured thn we are sending that error as a response
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "User deleted successfully" });
    });
};

//we are adding following list of an user
exports.addFollowing = (req, res, next) => {
    //logged in userid                  //The id of the user which the loggedin user wants to follow
User.findByIdAndUpdate(req.body.userId,{ $push: { following: req.body.followId } },(err, result) => {//the push is going to push the info of the id who wants to follow in the following array
//if error while perfomring follow  we need to respond with the status as 400
if (err) {
return res.status(400).json({ error: err });
}
next();
}
);
};
//we need to have a method for adding followers list to an user 
exports.addFollower = (req, res) => {
//for the userId that we want to follow we are adding the followers list as our userId when we follow that user
                           //we want to be a follower of the followId user
User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } },
{ new: true }//we need to set this as true so that the mongodb returns the updated data of the followers list 
)
//so when a user click the follow addFollowing and addFollower both the methods are called and we need to populate the following,followers list and return the result(user object)
.populate("following", "_id name")
.populate("followers", "_id name")
.exec((err, result) => {
if (err) {
return res.status(400).json({
error: err
});
}
result.hashed_password = undefined;
result.salt = undefined;
res.json(result);
});
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
User.findByIdAndUpdate(
req.body.userId,
{ $pull: { following: req.body.unfollowId } },
(err, result) => {
if (err) {
return res.status(400).json({ error: err });
}
next();
}
);
};

exports.removeFollower = (req, res) => {
User.findByIdAndUpdate(
req.body.unfollowId,
{ $pull: { followers: req.body.userId } },
{ new: true }
)
.populate("following", "_id name")
.populate("followers", "_id name")
.exec((err, result) => {
if (err) {
return res.status(400).json({
error: err
});
}
result.hashed_password = undefined;
result.salt = undefined;
res.json(result);
});
};



exports.findPeople=(req,res)=>{
    let following=req.profile.following;
    following.push(req.profile._id);//so we are pushing the user who we are visiting even that users profile is pushed into the following list 
    User.find({_id:{$nin:following}},(err,users)=>{//so we are going to find the users id whom we are not following (we do that by not incuding sign $nin will disincule the object we pass)
        if(err){
            return res.status(400).json({error:err})
        }
        
            //we are going to send the list of users
            res.json(users);
    }).select('name');//while returning the properties we are just going to select the name alone of the user and display in the suggestion

}