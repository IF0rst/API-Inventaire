import {register, login, checkJWT} from "../services/service.auth.js";

export const authLoginPost = (req,res) =>{
    const {username,password} = req.body;

    if (!username || !password){
        res.status(401).json({error:true,data:{message:"username and password is required."}});
    }

    try{
        const token = login(username,password);
        res.cookie("jwt",token);
        res.status(200).json({error:false,data:{message:"login_success"}})
    }catch (e){
        res.status(401).json({error:true,data:{message:e.message}});
    }
}

export const authRegisterPost = (req,res) =>{
    const {username,password} = req.body;

    if (!username || !password){
        res.status(401).json({error:true,data:{message:"username and password is required."}});
        return
    }

    try{
        res.status(200).json({error:false,data:register(username,password)})
    }catch (e){
        res.status(401).json({error:true,data:{message:e.message}});
    }
}

export const authWhoamiGet = (req,res) =>{
    const {jwt} = req.cookies;

    if (!jwt){
        res.status(401).json({error:true,data:{message:"jwt not found"}});
        return
    }

    try{
        const {username,userId} = checkJWT(jwt);
        res.status(200).json({error:false,data:{username,userId}});
    }catch (e){
         res.status(401).json({error:true,data:{message:e.message}});
    }
}