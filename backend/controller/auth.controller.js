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


export const signOut = async(req,res,next)=>{
    try{
        res.clearCookie('access_token');
        res.status(201).json('user logged out successfully!')
    
    }catch(error){
        next(error)
    }
}


export const deleteAccount = async (req,res,next)=>{
    try{
        if(req.user.id != req.params.id){
            return next(errorHandler(401,'you are not authorized to delete this account!'));
        }

        await User.findOneAndDelete(req.params.id);
        res.status(201).json('your account deleted successfully!');
    }catch(error){
        next(error)
    }
}


export const updateUser = async(req,res,next)=> {
    try{
        const userId = req.params.id;
        const existingUser = User.findById(userId);
        if(!existingUser) return next(errorHandler,'user not found!');

        const {email,username,password,avatar} = req.body;

        const updates = {
            username:username || existingUser.username,
            email:email || existingUser.email,
            password:password ? bcryptjs.hashSync(password, 10) :  existingUser.password ?
            avatar: avatar || existingUser.avatar

        }

        const updateUser = await User.findByIdAndUpdate(userId, {$set:updates}, {new:true});
        if(!updateUser) return next(errorHandler(404,'user not found'));

        const token = jwt.sign({id:updateUser.id},process.env.JWT_SECRET);
        const {password:pass, ...rest} = updateUser._doc;
        res.status(201).json({rest,token});
    
    }catch(error){
        next(error)
    }

}