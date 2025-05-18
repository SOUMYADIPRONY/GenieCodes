import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

import dotenv from 'dotenv';
dotenv.config();

export const authUser = async(req, res, next)=>{

    try{
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            process.exit(1);
        }       
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        if(!token){
            console.log("The token issue is here!")
            return res.status(401).send({error: "Unauthorized"})
        }
        const isBlackListed = await redisClient.get(token);
       
        if(isBlackListed){
            console.log('Login failed')
            res.cookie('token', '')
            return res.status(401).send({error: "Unauthorized user, token expired"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }
    catch(error){
        console.log(error)
        return res.status(401).send({error: "Profile not found"})
    }
}