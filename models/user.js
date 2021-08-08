const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,//this is a long random string that is generated every time
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String,
        trim: true
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        default: "subscriber"
    }
});



// virtual field
userSchema.virtual("password").set(function(password) {
     //create a temporary variable called _password that stores the value that we get from the password(which is the plane password)
      
        this._password = password;
        // generate a timestamp
        this.salt = uuidv1();//this uuidv1() generates a timestamp which will be a unique long string and we are storing that to the salt property that we defined before the
        // encryptPassword()
         //this.salt contains the a unique key that can be considered as a ssl key--ssl keys are 
         //we are storing the encrypted password into the hashed_password property that we defined in the schema
        this.hashed_password = this.encryptPassword(password);//this encrypted_password() method is also from the userschema object that takes the plane password and converts it and sends the encrypted password
    })
    .get(function() {
        return this._password;//this will return the plane password
    });



 //methods
 //The schemas that we define can have multiple properties and including it can have methods inside which we can define what ever methods we want
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {//this method gets the plain password
        if (!password)
        {   //if we dont enter any password we need to return an empty string
             return "";
        }
        try {
            return crypto
                .createHmac("sha1", this.salt)//sha1 is the format / the way we encrypt and the next parameter is ssl key which uniquely identifies the user
                .update(password)//we are sending the plain password here and that will be converted in hexadecimal format 
                .digest("hex");
        } catch (err) {
             //if the process of hashing or encryption failed we come to this catch block 
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);// so we are creating a user model using this syntax so now after this we can use this userSchema in other files
