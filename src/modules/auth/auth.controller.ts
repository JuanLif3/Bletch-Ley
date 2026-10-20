import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserPublic } from '../users/entities/user.entity';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authSerive: AuthService,
    ) {}

    // * Registro
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: RegisterDto) {
        return this.usersService.register(dto);
    }

    // * Login
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        return this.authSerive.login(dto);
    }

    // * GET /auth/me - protegido
    // * @UseGuards(JwtAuthGuard) → requiere token válido
    // * @CurrentUser() → usuario autenticado (extraído del token)
    // * Si el token falta o es inválido → 401 automático
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: UserPublic) {
        return user;
    }
}