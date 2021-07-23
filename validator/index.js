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
        console.log("entered da dai 1");
        const firstError=errors.map((error)=>error.msg)[0];
        console.log(firstError);
        return res.status(400).json({error:firstError}); 
    }
    next();//so after this validator(it does the validation) the control goes to the create post and post will be created and all kind of validation is done here and while saiving the post no need to check for the errors
}

