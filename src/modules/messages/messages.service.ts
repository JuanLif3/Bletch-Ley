import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindMessagesQueryDto } from './dto/find-messages-query.dto';
import { MessageWithSender } from './entities/message.entity';
import {CreateDirectChatDto} from "../chats/dto/create-direct-chat.dto";

@Injectable()
export class MessagesService {
    constructor(private readonly repo: MessagesRepository) {}

    // * Enviar mensaje
    async send (
        chatId: string,
        userId: string,
        dto: CreateMessageDto,
    ): Promise<MessageWithSender> {
        await this.ensureMembership(chatId, userId);
        return this.repo.create(chatId, userId, dto);
    }

    // * Listar mensajes
    async findByChat(chatId: string, userId: string, query: FindMessagesQueryDto) {
        await this.ensureMembership(chatId, userId);

        const {data, total} = await this.repo.findByChat(
            chatId,
            query.limit ?? 50,
            query.offset ?? 0,
        );

        return {
            data,
            total,
            limit: query.limit ?? 50,
            offset: query.offset ?? 0,
        };
    }

    // * Verificar que el usuario sea miembro del chat
    private async ensureMembership (chatId: string, userId: string) {
        const member = await this.repo.findMembership(chatId, userId);

        if (!member) {
            // ! El chat puede existir o no. No revelamos cual. Pero para UX, distribuimos "chat no existe" vs "no eres miembro"
            throw new ForbiddenException('No eres miembro de este chat');
        }
    }
}