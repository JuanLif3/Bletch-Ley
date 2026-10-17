import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger (PrismaService.name); // ! Mensajes con contexto

  constructor (config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL no esta definida en el entorno');
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  // * Arrancar el modulo: conectar
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectando a la DB via prisma');
  }

  // * Apagar el modulo: Desconectar
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado de la DB');
  }
}