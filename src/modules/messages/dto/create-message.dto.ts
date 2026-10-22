import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'El mensaje no puede estar vacio' })
    @MaxLength(2000, { message: 'El mensaje no puede superar 2000 caracteres' })
    content!: string;
}