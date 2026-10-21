export type { Chat, ChatMember } from '../../../../generated/prisma/client';

// * Un chat con sus miembros y sus datos de usuario incluidos
export interface ChatMemberWithUser {
    id: string;
    role: string;
    joinedAt: Date;
    user: {
        id: string;
        email: string;
        username: string;
    };
}

export interface ChatWithMembers {
    id: string;
    name: string | null;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    members: ChatMemberWithUser[];
}