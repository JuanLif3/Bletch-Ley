import {BadRequestException, Injectable} from '@nestjs/common';
import { ChatsRepository } from './chats.repository';
import { CreateDirectChatDto } from './dto/create-direct-chat.dto';
import { ChatWithMembers } from './entities/chat.entity';
import {PrismaService} from "../../database/prisma.service";

@Injectable()
export class ChatsService {
    constructor(
        private readonly repo: ChatsRepository,
    ) {}

    async createDirectChat(
        currentUserId: string,
        dto: CreateDirectChatDto,
    ): Promise<ChatWithMembers> {

        // ! Verificar que no sea consigo mismo
        if(currentUserId === dto.participantId) {
            throw new BadRequestException('No puedes crear un chat contigo mismo');
        }

        // ! Buscar si ya existe el chat directo
        const existing = await this.repo.findDirectChat(
            currentUserId,
            dto.participantId,
        );
        if (existing) {
            return existing;
        }

        // ! Si no existe, crear
        return this.repo.createDirectChat(currentUserId, dto.participantId);
    }

    // * Buscar usuarios de chats
    findUserChats(userId: string): Promise<ChatWithMembers[]> {
        return this.repo.findUserChats(userId);
    }
}