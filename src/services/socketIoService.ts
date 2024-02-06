import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import ChatRepository from '../repositories/ChatRepository';
import { IChat, IMessage } from '../models/Chat';

const chatRepository = new ChatRepository();

interface ChatMessage {
  courseId: string;
  message: IMessage;
}

const httpServer = createServer();
const io = new Server(httpServer,{
    cors:{
        // origin:[""],
        methods:["GET","POST"]
    }
});

io.on("connection",(socket:Socket)=>{
    console.log("user connected");    

    socket.on("join-room",(data:{courseId: string})=>{
        socket.join(data.courseId);
        console.log("joined room",data.courseId);
    
        // io.to(data.courseId).emit("active-members")
    });

    socket.on("get-all-messages",async({courseId})=>{
        
        const messages = await chatRepository.getChatByCourseId(courseId);       
        io.to(courseId).emit("get-course-response",messages)
    })

    socket.on("send-message",async(data:ChatMessage)=>{
        const { courseId, message } = data;
        console.log(courseId,message);
        
        const existChat = await chatRepository.getChatByCourseId(courseId);
        if(existChat){
            await chatRepository.addMessage(courseId,message);
        } else {
            const chatData = {
                courseId:courseId,
                messages:[message],
                 
            }
            await chatRepository.createChatRoom(chatData);

        }
        io.to(data.courseId).emit("message-recieve",data.message)
    })

    socket.on("disconnect",()=>{
        console.log("user disconnecte");       
    })

});

httpServer.listen(4000,()=>{
    console.log("socket io connected 4000");
    
})

export { io, httpServer }
