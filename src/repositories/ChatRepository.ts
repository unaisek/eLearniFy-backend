import BadRequestError from "../common/errors/badRequestError";
import Chat, { IChat, IMessage } from "../models/Chat";
import { IChatRepository } from "./interfaces/IChatRepository";

export default class ChatRepository implements IChatRepository {
    async createChatRoom(chatDetails: Partial<IChat>): Promise<IChat> {
        try {
            return await Chat.create(chatDetails)
            
        } catch (error) {
            throw error
        }
    }

    async getChatByCourseId(courseId: string): Promise<IChat | null> {
        try {

            return Chat.findOne({courseId:courseId}).populate('messages.senderId')
            
        } catch (error) {
            throw error
        }
    }

    async addMessage(courseId:string, message:IMessage):Promise<IChat>{
        try {

            const chat = await Chat.findOne({courseId});
            if(!chat){
                throw new BadRequestError("Chat not found")
            }
            chat.messages?.push(message);
            return await chat.save()
        } catch (error) {
            throw error
        }
    }
}