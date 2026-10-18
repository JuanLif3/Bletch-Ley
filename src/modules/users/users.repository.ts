import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User, UserPublic } from './entities/user.entity';

// * userPublicSelect: campos a devolver en respuestas HTTP (sin password)

const userPublicSelect = {
    id: true,
    email: true,
    username: true,
    createdAt: true,
    updatedAt: true,
} as const;

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    // * Buscar por email (Con password, para login)
    findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {email},
        });
    }

    // * Buscar por username
    findByUsername(username: string): Promise<UserPublic | null> {
        return this.prisma.user.findUnique({
            where: {username},
            select: userPublicSelect,
        });
    }

    // * Buscar por id (sin password, para respuestas)
    findById(id: string): Promise<UserPublic | null> {
        return this.prisma.user.findUnique({
            where: { id },
            select: userPublicSelect,
        });
    }

    // * Crear un usuario
    create (data: {
        email: string;
        username: string;
        password: string;
    }): Promise<UserPublic> {
        return this.prisma.user.create({
            data,
            select: userPublicSelect,
        });
    }

}
