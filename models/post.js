const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
     //In the post we can also upload a photo and for now lets consider it as a type string
    photo: {
        data: Buffer,//the size of the image is bigger in size so it cant be transfered completely from one end to another end fastly so buffer is a physical memory storage used to temporarily store data while it is being moved from one place to another place.
                     //we will be storing the image in a binary data format in the database so later we can extract from the database and give it to front end . 
        contenType: String //We will be storing the information of the image like which format it is in the string type
    },
     //This postedBy property says which user posted this particular post
    postedBy: {
        type: ObjectId,//the post is posted by a user and a user is also mongoose schema that we define ,so we get the objectId from the mongoose schema mention that it is also typeo of schema we are talking about
        ref: "User"//we are refering to the User model
    },
     updated: Date,
     //And also we need to keep track of the date that the post is created 
    created: {
        type: Date,
        default: Date.now//when ever a post is created we are going to assign the current date as its default date value
    },
    likes:[{type:ObjectId,ref:"User"}]//this is an array of likes of various users 

});

module.exports = mongoose.model("Post", postSchema);
