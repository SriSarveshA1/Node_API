const express=require('express');
const app=express();
const postRoutes=require('./routes/post');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true }).then(()=>console.log("DB Connected"));//we pass { useNewUrlParser: true } to connect to get rid of deprecation warnings.

mongoose.connection.on("error",(err)=>{
    console.log(err.message);
})

const morgan=require('morgan');
app.use(morgan("dev"));
app.use(bodyParser.json())



app.get('/',postRoutes);
app.post('/post',postRoutes)

const port =process.env.PORT||3000;//So either in production environment we set the port(in .env file we set the port) or default 3000 is the port
app.listen(port,()=>{
    console.log("sds");
});
