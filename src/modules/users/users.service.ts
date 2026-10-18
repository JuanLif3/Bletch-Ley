import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserPublic } from './entities/user.entity';

// * Cuantas veces se aplica el hash, 10 es el estandar | Mas alto = mas seguro pero mas lento
const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
    constructor(private readonly repo: UsersRepository) {}

    // * Registro de usuario
    async register (dto: RegisterDto): Promise<UserPublic> {

        // ! Email unico
        const existingEmail = await  this.repo.findByEmail(dto.email);
        if (existingEmail) {
            throw new ConflictException('El email ya esta registrado');
        }

        // ! Username unico
        const existingUsername = await this.repo.findByUsername(dto.username);
        if (existingUsername) {
            throw new ConflictException('El usuario ya esta en uso');
        }

        // ! Hashear password
        const handlePassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

        // ! Crear usuario
        return this.repo.create({
            email: dto.email,
            username: dto.username,
            password: handlePassword,
        });
    }

    // * Buscar por id (para /user/me y similares)
    async findById(id: string): Promise<UserPublic> {
        const user = await this.repo.findById(id);
        if (!user) {
            throw new NotFoundException(`Usuario ${id} no encontrado`);
        }
        return user;
    }
}