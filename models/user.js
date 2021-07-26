const mongoose=require('mongoose');
const uuidv1=require('uuidv1');
const crypto=require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:"string",
        trim:true,
        required:true
    },
    email:{
        type:"string",
        trim:true,
        required:true
    },
    hashed_password:{
        type:"string",
        required:true
    },
    salt:String,//this is a long random string that is generated every time
    created:{//created date
      type:Date,
      default:Date.now//by default we use to get the current date using this method
    },
    updated: {  //updated dat
        type:Date,
       
    }

});

 userSchema.virtual('password').set(function(v){
    //create a temporary variable called _password that stores the value that we get from the password(which is the plane password)
   const _password=v;//this v contains plain password
   this.salt=uuidv1();//this uuidv1() generates a timestamp which will be a unique long string and we are storing that to the salt property that we defined before the
   //this.salt contains the a unique key that can be considered as a ssl key--ssl keys are 
   //we are storing the encrypted password into the hashed_password property that we defined in the schema
   this.hashed_password=this.encrypted_password(v);//this encrypted_password() method is also from the userschema object that takes the plane password and converts it and sends the encrypted password
 })
 .get(function(){
     return this.password;//this will return the plane password
 });


 //methods
 //The schemas that we define can have multiple properties and including it can have methods inside which we can define what ever methods we want
 userSchema.methods={
   authenticate: function(password){
     return this.encrypted_password(password)==this.hashed_password;
   },
   encrypted_password:function(password){//this method gets the plain password
       if(!password)
       {
          //if we dont enter any password we need to return an empty string
          return "";
       }
       try{
         return crypto.createHash("sha1",this.salt) //sha1 is the format / the way we encrypt and the next parameter is ssl key which uniquely identifies the user
         .update(password)//we are sending the plain password here and that will be converted in hexadecimal format 
         .digest("hex");
      
       }
       catch(err){
          //if the process of hashing or encryption failed we come to this catch block 
          return "";
       }
   }   
 }
module.exports=mongoose.model("User",userSchema);// so we are creating a user model using this syntax so now after this we can use this userSchema in other files