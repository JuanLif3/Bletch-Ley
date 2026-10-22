import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindMessagesQueryDto } from './dto/find-messages-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPublic } from '../users/entities/user.entity';

@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly service: MessagesService) {}

    // * POST /chats/chatId:/message - enviar
    @Post()
    send(
        @Param('chatId', ParseUUIDPipe) chatId: string,
        @Body() dto: CreateMessageDto,
        @CurrentUser() user: UserPublic,
    ) {
        return this.service.send(chatId, user.id, dto);
    }

    // * GET /chats/:chatId/messages — listar
    @Get()
    findByChat(
        @Param('chatId', ParseUUIDPipe) chatId: string,
        @Query() query: FindMessagesQueryDto,
        @CurrentUser() user: UserPublic,
    ) {
        return this.service.findByChat(chatId, user.id, query);
    }
}