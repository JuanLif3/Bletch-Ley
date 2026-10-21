import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateDirectChatDto} from "./dto/create-direct-chat.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {UserPublic} from "../users/entities/user.entity";

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
    constructor(private readonly service: ChatsService) {}

    @Post('direct')
    create(
        @Body() dto: CreateDirectChatDto,
        @CurrentUser() user: UserPublic,
    ) {
        return this.service.createDirectChat(user.id, dto);
    }

    @Get()
    findUserChats(
        @CurrentUser() user: UserPublic,
    ) {
        return this.service.findUserChats(user.id);
    }
}