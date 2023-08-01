import {Controller, Get} from '@nestjs/common';
import {Client} from './client';

@Controller()
export class AppController {
  constructor(private readonly client: Client) {}

  @Get('token')
  async requestSpeechToken() {
    return this.client.requestSpeechToken();
  }
}
