import User from "../model/user.model";
import { errorHandler } from "../utils/error";
import bcryptjs, { compare } from 'bcryptjs';


export const signup = async(req,res,next)=>{
    const {username,email,password} = req.body;

    try{
        const hashPassword = bcryptjs.hashSync(password,10);
        const user  =  User ({username,email,password:hashPassword});

        await user.save();
        res.status(201).json('account created successfully!');
    }catch(error){
        next(error)
    }
}


export const signin = async(req,res,next)=>{
    const {email,password} = req.body;

    try{
        const validUser = await User.findOne({email});
        if(!validUser) return  next(errorHandler(401,'user not found!'));

        const validPassword = bcryptjs.compare.hashSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401,'wrong credentials!'));
        
        const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET);
        const {password:pass, ...rest} = validUser._doc;

        res.status(201).json({rest,token})
    }catch(error){
        next(error)
    }
}


