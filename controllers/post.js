const Post=require('../models/post');
const formidable=require('formidable');
const fs = require('fs');


const getPost=(req,res)=>{
    const posts=Post.find()
    .populate("postedBy","_id name")
    .select("_id title body")
    .then((posts)=>{res.status(200).json({posts})})
    .catch((err)=>console.log(err));
    

  };
const postById=(req,res,next,id)=>{
  //we are going to find the post based on the id that we pass in the request url
  Post.findById(id)
  .populate("postedBy","_id name")
  //after doing the above methods this exec function will be executed
  .exec((err,post)=>{
     
      if(err||!post)
      {
         return res.status(400).json({
            error:err
         })
      }
      //if there is no error while finding the post by id then
      //then we append a new property like post in the request object and assign post object to it
      req.post=post;
      next();//then we will move to next middleware
   })
}

const createPost = (req, res,next) => {

   let form=new formidable.IncomingForm();//we are creating object for this method/constructor fomidable.IncomingForm()  this will give incoming form fields 
   form.keepExtensions=true;//so the format of the files like whether it is .txt or .jpeg so this will keep the
   form.parse(req,(err,fields,files)=>{ //this parse method will parse the req object and there is a callback function that takes err,fields,files as parameter
      if(err) {
         return res.status(400).json({
            error:"Image could not be uploaded"
         })
      }
      let post=new Post(fields);//so we are creating a new post object with the same and exact fields as the req.body and this post will also be like the request body
      //so we are appending new property that we mentioned in the post schema

      req.profile.hashed_password=undefined;//so in the req.profile we have the user object and when we want to create a new post and want to store the info about which user posted the post
      req.profile.salt=undefined;

      post.postedBy=req.profile;//it will contain id,name and all the info about the user who posted the post
      if(files.photo){
         //if the request has photo in the fields we will be getting it and if files.photo is true then that files contains photo and the user uploaded a photo
         //so we want the post to have some new properties like photo and photo itself has data,contentTypre as its property
         post.photo.data=fs.readFileSync(files.photo.path); //so the path of the photo that we uploaded in the front end will be in the files.photo.path
         //readFileSync will read the photo file from the given path and it will store the photo in the binaray form of data in the database
         post.photo.contentType=files.photo.type;//And also the type of the photo we store here
      }
      //then we save the photo 
      post.save((err,result) => {
         if(err) {
            //if there is any error that we got while saving 
            return res.status(400).json({
               error:err
            });
         }
         
         res.json(result);
      })
   });
   }

const postsByUser =(req,res) => {
   Post.find({postedBy:req.profile._id})
   .populate("postedBy","_id name")//we are going to put the user id and the name along with the posts that that particular user posted 
   .sort("_created")
   //after executing all the abouve chain functions
   .exec((err,posts)=>{
      if(err){
         return res.json({
            error:err
         })
      }
      //if there is no error we send the json response of the posts
      res.json(posts);
   });
}
module.exports={getPost,createPost,postsByUser,postById}; 