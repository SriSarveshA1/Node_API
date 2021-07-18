const express=require('express');
const app=express();
const postRoutes=require('./routes/post')
const morgan=require('morgan');
app.use(morgan("dev"));
app.get('/',postRoutes);


const port =3000;
app.listen(port,()=>{
    console.log("sds");
});
