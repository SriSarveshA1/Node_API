const getPost=(req,res)=>{
    res.send("Hlo from the functionality of the post from the controllers");
    res.json({
      post:[{title:'1'},{title:'2'},{title:'3'}]
         }
      );
  }
  module.exports={getPost};