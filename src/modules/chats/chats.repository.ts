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

    // * Creacion de grupo | El creador como 'admin', los demas como 'member'
    async createGroup(
        creatorId: string,
        name: string,
        memberIds: string[],
    ): Promise<ChatWithMembers> {
        // Deduplicar y excluir al creador
        const uniqueMembers = [...new Set(memberIds)].filter(
            (id) => id !== creatorId,
        );

        const chat = await this.prisma.chat.create({
            data: {
                type: 'group',
                name,
                members: {
                    create: [
                        { userId: creatorId, role: 'admin' },
                        ...uniqueMembers.map((userId) => ({
                            userId,
                            role: 'member',
                        })),
                    ],
                },
            },
            include: {
                members: { select: memberSelect },
            },
        });

        return chat as ChatWithMembers;
    }

    // * Buscar chat por ID
    async findById(chatId: string): Promise<ChatWithMembers | null> {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                members: { select: memberSelect },
            },
        });

        return chat as ChatWithMembers | null;
    }

    // * Verificar membresia de un usuario en un chat
    async findMemberShip(chatId: string, userId: string) {
        return this.prisma.chatMember.findUnique({
            where: {
                chatId_userId: { chatId, userId },
            },
        });
    }

    // * Actualizar nombre del chat
    async updateName(chatId: string, name: string): Promise<ChatWithMembers> {
        const chat = await this.prisma.chat.update({
            where: { id: chatId },
            data: { name },
            include: {
                members: { select: memberSelect },
            },
        });

        return chat as ChatWithMembers;
    }

    // * Agregar miembro
    async addMember(
        chatId: string,
        userId: string,
        role: 'admin' | 'member' = 'member',
    ): Promise<ChatMemberWithUser> {
        const member = await this.prisma.chatMember.create({
            data: { chatId, userId, role },
            select: memberSelect,
        });

        return member as ChatMemberWithUser;
    }

    // * Quitar miembro
    async removeMember(chatId: string, userId: string): Promise<boolean> {
        try {
            await this.prisma.chatMember.delete({
                where: { chatId_userId: { chatId, userId } },
            });
            return true;
        } catch {
            return false;
        }
    }

    // * Contar admins de un chat, util ppara validar que no se quede sin admins
    async countAdmins(chatId: string): Promise<number> {
        return this.prisma.chatMember.count({
            where: { chatId, role: 'admin' },
        });
    }

    // * Verificar que un usuario existe para validar abtes de agregar a un grupo
    async userExists(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        return !!user;
    }
}