const express=require('express');
const app=express();
const postRoutes=require('./routes/post');
const authRoutes=require('./routes/auth');
const UserRoutes=require('./routes/user');
const fs=require('fs');
const cors=require('cors');

const mongoose=require('mongoose');
var cookieParser = require('cookie-parser')

const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const dotenv=require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true }).then(()=>console.log("DB Connected"));//we pass { useNewUrlParser: true } to connect to get rid of deprecation warnings.
mongoose.connection.on("error",(err)=>{
    console.log(err.message);
})

const morgan=require('morgan');
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser()) 
app.use(cors());

app.get("/",(req,res)=>{
  //we are going to read the file that is in the path
  fs.readFile("docs/apiDocs.json",(err,data)=>{
    if(err){
      
      return  res.status(400).json({
         error:err
      });

    }
    const docs = JSON.parse(data);
    res.json(docs);
  })
})
app.put('/post/:postId',postRoutes);
app.delete("/post/:postId",postRoutes);
app.get("/posts/by/:userId",postRoutes);
app.post('/post/new/:userId',postRoutes)
app.post('/signup',authRoutes); 
app.post('/signin',authRoutes);
app.get('/signout',authRoutes);
app.get('/users',UserRoutes); 
app.get('/user/:userId',UserRoutes); 
app.put('/user/:userId',UserRoutes); 
app.delete('/user/:userId',UserRoutes);
app.get('/posts',postRoutes);//default route which will get all the posts like a news feed

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({message: 'Unauthorized!'});
    }
  });

const port =process.env.PORT||3000;//So either in production environment we set the port(in .env file we set the port) or default 3000 is the port
app.listen(port,()=>{
    console.log("sds");
});
