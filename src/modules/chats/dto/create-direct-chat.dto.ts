import { IsUUID } from 'class-validator';

// * Chat 1:1
export class CreateDirectChatDto {
    @IsUUID()
    participantId!: string;
}