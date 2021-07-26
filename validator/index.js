exports.createPostValidator=(req,res,next)=>{
    req.check("title","Write the title").notEmpty();
    req.check("title","Title must be 4 to 150 characters").isLength({
    min:4,
    max:150
    });
    req.check("body","Write the Body").notEmpty();
    req.check("body","body must be 4 to 2000 characters").isLength({
    min:4,
    max:2000
    });
    const errors=req.validationErrors();
    if(errors)
    {
      
        const firstError=errors.map((error)=>error.msg)[0];
        console.log(firstError);
        return res.status(400).json({error:firstError}); 
    }
    next();//so after this validator(it does the validation) the control goes to the create post and post will be created and all kind of validation is done here and while saiving the post no need to check for the errors
}

exports.createSignUpValidator=(req,res,next)=>{
    //name is not null and between 4 to 10 characters
    req.check("name","Name is required").notEmpty();//if we didnt enter any value for the name then the "Name is required" will be printed
    //name is must be having 4 to 10 characters
    req.check("name","Name must be 4 to 10 characters").isLength({
        min:4,
        max:10
    });
    
    //Email must not be empty and it should be within the range of 3 to 32 characters
    req.check("email","Email is required").notEmpty();//if we didnt enter any value for the email then the "Email is required" will be printed
    req.check("email","Email must be 3 to 32 characters")
    .matches(/.+\@.+\..+/)//this is a regex that checks whether the email contains @ and other constraints that it must have been entered
    .withMessage("Email must contain @")//So if the above regex match is failed then we must print Email must contain @. ............... This .withMessage() is chained after a function and this .withMessage() is called if that function is failed
    .isLength({
        min:12,
        max:2000
    })
    
    //check for password
    req.check("password","Password is required").notEmpty();
    req.check("password")
    .isLength({
        min:6   //we are setting that at minimum the characters in the password must be 6
    })
    .withMessage("password must be having a minimum of 6 characters")//so if the above length function is failed this will be called
    .matches(/\d/)
    .withMessage("Password must contain a digit")//so if there is no digit in the password then we print this message
    

    //check for errors
    const errors=req.validationErrors();//this will give array of objects of errors
    if(errors)
    {   // errors will be like errors=[{name:"ssdsd",msg:"sdsd"},{name:"ssdsd",msg:"sdsd"},,]
        const firstError=errors.map((error)=>error.msg)[0];//this map function will generally return an array .And we are taking only the [0]th error and taking --error.msg-- from the object and put it into the firstError variable.
        console.log(firstError);
        return res.status(400).json({error:firstError}); //Here if there is a error then we are returning the firstError as a response in json format
    }
    next();//then we send the control to next middleware


}