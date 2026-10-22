import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule} from "./modules/chats/chats.module";
import { MessagesModule} from "./modules/messages/messages.module";

@Module({
  imports: [
    // ! Carga .env y lo hace global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    PrismaModule,
      AuthModule,
      ChatsModule,
      MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
