const express=require('express');
const app=express();
const {getPosts}=require('./routes/post')
const morgan=require('morgan');
app.use(morgan("dev"));
app.get('/',getPosts);


const port =3000;
app.listen(port,()=>{
    console.log("sds");
});
