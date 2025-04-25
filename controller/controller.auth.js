import {register, login, checkJWT} from "../services/service.auth.js";

export const authLoginPost = (req,res) =>{
    const {username,password} = req.body;

    if (!username || !password){
        res.status(401).json({error:true,message:"username and password is required."});
    }

    try{
        const token = login(username,password);
        res.cookie("jwt",token);
        res.status(200).json({error:false,message:"login with success!"})
    }catch (e){
        res.status(401).json({error:true,message:e.message});
    }
}

export const authRegisterPost = (req,res) =>{
    const {username,password} = req.body;

    if (!username || !password){
        res.status(401).json({error:true,message:"username and password is required."});
        return
    }

    try{
        register(username,password);
        res.status(200).json({error:false,message:"registered with success!"})
    }catch (e){
        res.status(401).json({error:true,message:e.message});
    }
}

export const authWhoamiGet = (req,res) =>{
    const {jwt} = req.cookies;

    if (!jwt){
        res.status(401).json({error:true,message:"jwt not found"});
        return
    }

    try{
        const {username,userId} = checkJWT(jwt);
        res.status(200).json({error:false,username,userId});
    }catch (e){
         res.status(401).json({error:true,message:e.message});
    }
}