export type { Message } from '../../../../generated/prisma/client'

export interface MessageWithSender {
    id: string;
    content: string;
    chatId: string;
    senderId: String;
    expiresAt: Date | null;
    createdAt: Date;
    sender: {
        id: string;
        email: string;
        username: string;
    };
}