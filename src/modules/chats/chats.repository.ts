import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ChatMemberWithUser, ChatWithMembers } from './entities/chat.entity';

const memberSelect = {
    id: true,
    role: true,
    joinedAt: true,
    user: {
        select: {
            id: true,
            email: true,
            username: true,
        },
    },
} as const;

@Injectable()
export class ChatsRepository {
    constructor(private readonly prisma: PrismaService) {}

    // * Buscar chat 1:1 entre dos usuarios
    async findDirectChat (
        userA: string,
        userB: string,
    ): Promise <ChatWithMembers | null> {
        const chat = await this.prisma.chat.findFirst({
            where: {
                type: 'direct',
                AND: [
                    { members: { some: { userId: userA } } },
                    { members: { some: { userId: userB } } },
                ],
            },
            include: {
                members: {
                    select: memberSelect,
                },
            },
        });

        // ! Verificar que tiene exactamente 2 miembros (no es un grupo)
        if (chat && chat.members.length === 2) {
            return chat as ChatWithMembers;
        }

        return null;
    }

    // * Crear chat directo con 2 miembros
    async createDirectChat (
        userA: string,
        userB: string,
    ): Promise<ChatWithMembers> {
        const chat = await this.prisma.chat.create({
            data: {
                type: 'direct',
                name: null,
                members: {
                    create: [
                        { userId: userA, role: 'member' },
                        { userId: userB, role: 'member' },
                    ],
                },
            },
            include: {
                members: {
                    select: memberSelect,
                },
            },
        });

        return chat as ChatWithMembers;
    }

    // * Listar chats de un usuario
    async findUserChats(userId: string): Promise<ChatWithMembers[]> {
        const chats = await this.prisma.chat.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            include: {
                members: {
                    select: memberSelect,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return chats as ChatWithMembers[];
    }
}