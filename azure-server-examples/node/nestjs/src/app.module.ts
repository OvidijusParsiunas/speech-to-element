import {ExceptionMiddleware} from './middleware/exceptionMiddleware';
import {AppController} from './app.controller';
import {APP_FILTER} from '@nestjs/core';
import {Module} from '@nestjs/common';
import {Client} from './app.client';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    Client,
    {
      provide: APP_FILTER,
      useClass: ExceptionMiddleware,
    },
  ],
})
export class AppModule {}
