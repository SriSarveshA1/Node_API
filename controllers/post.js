const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.postById = (req, res, next, id) => {
    //we are going to find the post based on the id that we pass in the request url
    Post.findById(id)
        .populate("postedBy", "_id name")
        //after doing the above methods this exec function will be executed
        //.populate('comments','text created')//we need to get the comments of text type
        .populate('comments.postedBy','_id name')//and also we need to get the users _id name who posted the comment
        .select("_id title body created likes comments photo")

        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
             //if there is no error while finding the post by id then
             //then we append a new property like post in the request object and assign post object to it
            req.post = post;
            next();//then we will move to next middleware
        });
};

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .populate('comments','text created')//we need to get the comments of text type
        .populate('comments.postedBy','_id name')//and also we need to get the users _id name who posted the comment
        .select("_id title body created likes")//so we need to return the created date as well 
        .sort({created:-1}) //and while returning the posts we need to sort according to the latest posts 
        .then(posts => {
            res.json(posts);//returning as array in json
        })
        .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();//we are creating object for this method/constructor fomidable.IncomingForm()  this will give incoming form fields 
    form.keepExtensions = true;//so the format of the files like whether it is .txt or .jpeg so this will keep the
    form.parse(req, (err, fields, files) => {//this parse method will parse the req object and there is a callback function that takes err,fields,files as parameter
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let post = new Post(fields);//so we are creating a new post object with the same and exact fields as the req.body and this post will also be like the request body
      //so we are appending new property that we mentioned in the post schema

        req.profile.hashed_password = undefined;//so in the req.profile we have the user object and when we want to create a new post and want to store the info about which user posted the post
        req.profile.salt = undefined;
        post.postedBy = req.profile;//it will contain id,name and all the info about the user who posted the post

        if (files.photo) {
            //if the request has photo in the fields we will be getting it and if files.photo is true then that files contains photo and the user uploaded a photo
            //so we want the post to have some new properties like photo and photo itself has data,contentTypre as its property
            post.photo.data = fs.readFileSync(files.photo.path);//so the path of the photo that we uploaded in the front end will be in the files.photo.path
           //readFileSync will read the photo file from the given path and it will store the photo in the binaray form of data in the database
            post.photo.contentType = files.photo.type;//And also the type of the photo we store here
        }
        //then we save the photo 
        post.save((err, result) => {
            if (err) {
                 //if there is any error that we got while saving 
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate("postedBy", "_id name")//we are going to put the user id and the name along with the posts that that particular user posted 
        .select("_id title body created likes")//even while returning the posts of a single user we also send the likes along with it
        .sort("_created")
        //after executing all the abouve chain functions
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            //if there is no error we send the json response of the posts
            res.json(posts);
        });
};

exports.isPoster = (req, res, next) => {
    let isPoster =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;

    if (!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();//we are moving to next middleware
};
/*
exports.updatePost = (req, res, next) => {
    let post = req.post;
    post = _.extend(post, req.body);//so we are mutating the current post with the req.body(new content)
    post.updated = Date.now();//after updating we change the updated date as current date
    post.save(err => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
         //no error send the updated post
        res.json(post);
    });
};
*/

exports.updatePost=(req,res,next)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{//we parse the form data that takes the req data and in call back functions we are going to work with the fields and files
        if(err)
        {
            return res.status(400).json({
                error:"Photo could not be uploaded"
            })
        }
        //save post
        let post=req.post;//so when the url has the post id then params will catch and postById method will be invoked and req.profile will contain the post object
        post=_.extend(post,fields);//so we are updating the data in the post object when we update the post
        post.updated=Date.now();//storing the current date
        if(files.photo)
        {
            //if there is a photo in the files is true we put it in the post object
            post.photo.data=fs.readFileSync(files.photo.path);
            post.photo.contentType=files.photo.type;
        }
        post.save((err,result)=>{
          if(err)
          {
              return res.status(400).json({
                  error:err
              })
          }
         
          res.json({result});
        })
    })  
}
exports.deletePost = (req, res) => {
    let post = req.post;//so when ever there is a postId parameter in the url then the postById method will be invoked and the post object will be appened to the req object
    post.remove((err, post) => {
         //if there is error while removing the post we catch it or send the deleted post as json response or give a message
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: "Post deleted successfully"
        });
    });
};

exports.photo=(req,res,next)=>{
    //so here we are going to send the image to the front end 
    //and we set the content type from the request body that has the photo object attached in the front end that says what type of content is the photo
    res.set('Content-Type',req.post.photo.contentType)
    return res.send(req.post.photo.data);
}

exports.singlePost=(req,res)=>{
    //so when the url contains the postid then the postById method is invoked and in the req object the post for that id is added and we need to return that alone
    
    return res.json(req.post);
}

exports.like=(req,res)=>{
    //findByIdAndUpdate is a mongoose function that finds the document by id and update the content 
    //when ever user makes a like then from the front end we need to send the post id along with the request and also the userId so we can easily find which user liked it
    //we are going to push the userID to the likes in the array   
                                                                       //while returning the post it will return the updated post
    Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.body.userId}},{new:true})
    .exec((err,result)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        else{
            res.json(result);
        }
    });
}

exports.unlike=(req,res)=>{               //remove it
    Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.body.userId}},{new:true})
    .exec((err,result)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        else{
            res.json(result);
        }
    });
}

exports.comment=(req,res)=>{
    //so we create a comment object that gets the body and postedBy from the front end
    let comment=req.body.comment;
    comment.postedBy=req.body.postById;
                                    //we are going to push comment into the comments array
    Post.findByIdAndUpdate(req.body.postId,{$push:{comments:req.body.comment}},{new:true})
    .populate('comment.postedBy','_id name')//we are going to populate the id and name from the postedBy(refers to User object)
    .populate('postedBy','_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        else{
            res.json(result);
        }
    });
}
exports.uncomment=(req,res)=>{
   
    let comment=req.body.comment;
    
                                    //we are going to pull comment of the particular id from the comments array
    Post.findByIdAndUpdate(req.body.postId,{$pull:{comments:comment._id}},{new:true})
    .populate('comment.postedBy','_id name')//we are going to populate the id and name from the postedBy(refers to User object)
    .populate('postedBy','_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        else{
            res.json(result);
        }
    });
}