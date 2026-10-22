import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty({ message: 'El grupo debe tener un nombre' })
    @MaxLength (20, { message: 'El nombre no puede superar los 20 caracteres' })
    name!: string;

    // ? IDs de los usuario a agregar (ademas del creador) Minimo 1: el creador siempre se agrega como admin, mas al menos 1 mas
    @IsArray()
    @ArrayMinSize(1, { message: 'Un grupo debe tener al menos 2 miembros' })
    @IsUUID('4', { each: true, message: 'Cada miembro debe ser un UUID' })
    memberIds!: string[];
}