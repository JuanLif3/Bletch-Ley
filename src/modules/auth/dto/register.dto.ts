import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, {message: 'Email invalido'})
  email!: string;

  @IsString()
  @MinLength(3, {message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(20, {message: 'El nombre de usuario no puede tener mas de 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username solo puede tener letras, números y guión bajo' })
  username!: string;

  @IsString()
  @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(72, {message: 'La contraseña no puede superer los 72 caracteres' })
  password!: string;
}