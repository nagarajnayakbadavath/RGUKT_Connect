const validator=require('validator');

const validateSignupData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName || !lastName){
        throw new Error('enter the name');
    }else if(!validator.isEmail(emailId)){
        throw new Error('emailid is invalid');
    }else if(!validator.isStrongPassword(password)){
        throw new Error("enter the valid password");
    }
};

module.exports={
    validateSignupData,
};