import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { UserPublic } from '../../users/entities/user.entity';

interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy (Strategy) {
    constructor(
        config: ConfigService,
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string> ('JWT_SECRET')!,
        });
    }

    // * Validacion se ejecuta en cada request protegida
    async validate(payload: JwtPayload): Promise<UserPublic> {
        const user = await this.userService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('Usuario no existente')
        }

        return user;
    }
}