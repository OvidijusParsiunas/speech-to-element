import {Catch, ArgumentsHost} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';

@Catch()
export class ExceptionMiddleware extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Service error');
    console.log(exception.response.data.error.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(500).send(exception.response.data.error.message);
  }
}
