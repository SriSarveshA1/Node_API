const User=require('../models/user');
const _=require('lodash');

const userById=(req,res,next,id)=>{

    //Here we are finding the user with respect to the id that we got from the request url
    //And while executing the retrival part of the userInfo based on id ..and the callback function will be containing the err , user object ..if the retrival is successful we get the user object or as a err.
    User.findById(id,(err,user)=>{
       if(err||!user) {
           //if the user does not exist or if there is any error occured,
          return res.status(400).json({
             error:"User not found"
           });
       }
       //so if there is a user exists then we come here and append the user object to the new property called profile in the request object
       req.profile=user;//so we are adding profile property to the request object first and then assigning user object to it.
       next();//we want to next middleware function


    })
}
const hasAuthorization=(req,res,next) =>{

    const authorized=req.profile&&req.auth&&req.profile._id===req.auth._id;
    //               step 1       step 2    combnining both(step1 & step2)
    //In above statement gives true then the user who is requsting is authorized
    if(!authorized)
    { // if the user is not authorized
        return res.status(403).json({
            error:"User is not authorized to perform this action"
        })  
    }
}
const allUsers=(req,res)=>{
    //so here the find method is going to all the users that we created using signup method and it has a callback() that gets err,users object..if there is a error that occoured this err will have some value or users parameter gets all the users object
    User.find((err,users)=>{
       if(err){
           return res.status(400).json({
               error:err
           })
       }
       //if there is no error 
       res.json({users})
    }).select("name email updated created")//so we want to retrive these properties(name,email,updated,created) specifically 
}

const getUser=(req,res)=>{
    //we are going to select a single user and return his profile
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    return res.json(req.profile);// we know that when a request url is made based on getting the particular user profile there will be userId in the url and we need to retrive the user object from the router.param('userId',UserById) here in the UserById method the req.profile=user will be attached
}

const updateUser=(req,res,next) => {
   
   let user=req.profile;//so the req.profile contains the profile of the user with the given respective id in the url
   user=_.extend(user,req.body)//this extend metho  d gets the object that needs to be updated and the new content that we want to put
   //extend method basically mutate the sourse object with the content present in the req.bodyParser    
   //so when the user update their profile we want the updated date to be today
   user.updated=Date.now();
   //with the new change we need to store the new user object in the database
   user.save((err)=>{
       if(err){
           return res.status(400).json({
               error:"You are not authorized to perform this action"
           })
       }
       //if there is no error while saving then we send the response as user object
       //and we should not the hashed password or salt value
       
       user.hashed_password=undefined;
       user.salt=undefined;
       res.json({user});
       
   });
}

const deleteUser =(req,res,next)=>{
    let user=req.profile;//so when the request url contains the userid then UserById method will be invoked before itself
    user.remove((err,user)=>{
        if(err)
        {
            //if there is any error occured thn we are sending that error as a response
            return res.status(400).json({err});
        }

        //if we are able to delete successfully then we send the deleted user
        user.hashed_password=undefined;
        user.salt=undefined;
        res.json({user});
    })
}

module.exports={userById,hasAuthorization,allUsers,getUser,updateUser,deleteUser};