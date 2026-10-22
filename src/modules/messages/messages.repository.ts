import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MessageWithSender } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

// * Select reutilizable para el sender (sin password)
const senderSelect = {
    id: true,
    email: true,
    username: true,
} as const;

@Injectable()
export class MessagesRepository {
    constructor(private readonly prisma: PrismaService) {}

    // * Crear un mensaje
    async create (
        chatId: string,
        senderId: string,
        dto: CreateMessageDto,
    ): Promise<MessageWithSender> {
        const message = await this.prisma.message.create({
            data: {
                content: dto.content,
                chatId,
                senderId,
            },
            include: {
                sender: { select: senderSelect },
            },
        });

        return message as MessageWithSender;
    }

    // * Listar mensaje de un chat (paginado)
    async findByChat (
        chatId: string,
        limit: number,
        offset: number,
    ): Promise<{ data: MessageWithSender[]; total: number }> {
        const [data, total] = await Promise.all([
            this.prisma.message.findMany({
                where: {chatId},
                include: {sender: {select: senderSelect}},
                orderBy: {createdAt: 'asc'},  // ← los más viejos primero
                take: limit,
                skip: offset,
            }),
            this.prisma.message.count({where: {chatId}}),
        ]);

        return { data: data as MessageWithSender[], total };
    }

    // * Verificar si un usuario es miembro del chat
    async findMembership(chatId: string, userId: string) {
        return this.prisma.chatMember.findUnique({
            where: {
                chatId_userId: { chatId, userId },
            },
        });
    }
}