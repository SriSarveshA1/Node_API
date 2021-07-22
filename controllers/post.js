const Post=require('../models/post');


const getPost=(req,res)=>{
    const posts=Post.find().select("_id title body")
    .then((posts)=>{res.status(200).json({posts})})
    .catch((err)=>console.log(err));
    

  };

const createPost = (req, res) => {
   const post =new Post(req.body);//we can create a new post using the "new" keyword before the Post model
   post.save().then(result=>{
      res.status(200).json({
         post:result
      });
   });
}
module.exports={getPost,createPost}; 