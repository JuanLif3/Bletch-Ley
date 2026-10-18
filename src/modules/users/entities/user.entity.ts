export type { User } from '../../../../generated/prisma/client';

export interface UserPublic {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}