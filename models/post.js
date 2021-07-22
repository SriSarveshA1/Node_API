const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    title:{
      type:"string",
      required:"Title is required",
      minlength:5,
      maxlength:2000
    },
    body:{
        type:"string",
        required:"Body is required",
        minlength:10,
        maxlength:2500
    }

});

module.exports=mongoose.model("post",postSchema);