import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions} from "@nestjs/jwt";
import { ConfigModule, ConfigService, registerAs} from "@nestjs/config";
import { AuthController } from './auth.controller';
import { AuthService} from "./auth.service";
import { UsersModule } from '../users/users.module';
import { SignOptions } from 'jsonwebtoken';


@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '7d') as SignOptions['expiresIn'],
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}