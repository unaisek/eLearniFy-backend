import { IChat, IMessage } from "../../models/Chat";

export interface IChatRepository{
    createChatRoom(chatDetails:Partial<IChat>):Promise<IChat>;
    getChatByCourseId(courseId: string): Promise<IChat | null>
    addMessage(courseId:string, message:IMessage):Promise<IChat>
}