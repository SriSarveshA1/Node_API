const getPost=(req,res)=>{
  res.json({
    post:[{title:'1'},{title:'2'},{title:'3'}]
       }
    );
}
module.exports={getPost};
