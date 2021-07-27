const User=require('../models/user');

const userByid=(req,res,next,id)=>{

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
module.exports={userByid,hasAuthorization};