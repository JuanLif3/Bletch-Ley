import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateChatDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
    @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
    name?: string;
}