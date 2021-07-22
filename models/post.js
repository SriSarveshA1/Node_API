const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    title:{
      type:"string",
      required:true,
      minlength:4,
      maxlength:150
    },
    body:{
        type:"string",
        required:true,
        minlength:4,
        maxlength:2000
    }

});

module.exports=mongoose.model("post",postSchema);