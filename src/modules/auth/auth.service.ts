import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { UserPublic } from '../users/entities/user.entity';

export interface LoginResponse {
    access_token: string;
    user: UserPublic;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly usersRepo: UsersRepository,
        private readonly jwt: JwtService,
    ) {}

    // * Login
    async login(dto: LoginDto): Promise<LoginResponse> {
        // ! Buscar por email
        const user = await this.usersRepo.findByEmail(dto.email);

        // ! Si no existe, mismo error que si la contraseña fuera mala
        if (!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // ! Comprar password con hash
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        // ! Si no coincide, mismo error
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // ! Generar JWT | El payñoad (lo que va dentro del token) NO debe tener datos sensibles | sub = "subject" (el id del usuario, convencion JWT)
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };

        const access_token = await this.jwt.signAsync(payload);

        // ! Devolvemos el token + usuario publico
        const { password, ...userPublic } = user;

        return {
            access_token,
            user: userPublic as UserPublic,
        };
    }
}