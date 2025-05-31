import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

dotenv.config()


const port = process.env.PORT || 3008;
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: '*'
    }
});

io.use(async(socket, next)=>{
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;
        
        if(!projectId || !mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error("Invalid project ID"));
        }

        socket.project = await projectModel.findById(projectId)
        
        if(!token){
            return next(new Error("Token not received, socket connection failed"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded){
              return next(new Error("JWT token error, socket connection failed"))
        }

        socket.user = decoded;
        next();
    }
    catch(error){

        next(error)

    }
})

io.on('connection', socket => {


    socket.roomId = socket.project._id.toString()
    console.log("Client connected")
    socket.join(socket.roomId);

    socket.on('project-message', async data=>{
        console.log(data)
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data)
        if(aiIsPresentInMessage){
                const prompt = message.replace('@ai', '');

                const result = await generateResult(prompt);

                io.to(socket.roomId).emit('project-message',{
                    message: result,
                    sender:{
                        _id: 'ai',
                        email: 'AI'
                    }
                })
        }
        
    })
  socket.on('disconnect', () => { 
    console.log("User disconnected");
    socket.leave(socket.roomId)
  });
});

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})