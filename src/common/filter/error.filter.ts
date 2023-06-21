import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    let message: string = exception.message;
    let status: number = exception.status;
    let errorFields: unknown;
    if (exception instanceof MongooseError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }
    if (exception instanceof UnprocessableEntityException) {
      response.status(exception.getStatus()).send(exception.getResponse());
      return;
    } else if (!message && !status) {
      message = 'Internal Server Error';
      status = 500;
    }
    response.status(status).send({
      message: message,
      errorFields,
    });
  }
}
