import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger (PrismaExceptionFilter.name);

  catch (
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response> ();
    const request = ctx.getRequest<Request> ();

    const { status, message } = this.mapError (exception);

    // * Loguear sollo errores que NO son esperados (500)
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Prisma error [${exception.code}]: ${exception.message}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapError (exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      case 'P2002': {
        const target = exception.meta?.target;
        const fields = Array.isArray(target)
        ? target.join(', '): typeof target === 'string' ? target: 'ese valor';
        return {
          status: HttpStatus.CONFLICT,
          message: `Ya existe un registro con ${fields}`,
        };
      }
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'El recurso no existe',
        };
      case '2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referencia invalida a otro recurso',
        };
      case 'P2000':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Un valor excede el tamaño permitido',
        };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Relacion requerida no satisfecha',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error interno del servidor',
        };
    }
  }
}