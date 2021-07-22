const Post=require('../models/post');


const getPost=(req,res)=>{
    
    res.json({
      posts:[{title:'1'},{title:'2'},{title:'3'}]
         }
      );

  }

const createPost = (req, res) => {
   const post =new Post(req.body);//we can create a new post using the "new" keyword before the Post model
   post.save((err,result)=>{
      if(err){
        res.status(400).json({
            error:err
         }); 
         return;
      }
       res.status(200).json({
         post:result
      });
      
   })
}
module.exports={getPost,createPost}; 