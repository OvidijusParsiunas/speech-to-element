import {Injectable} from '@nestjs/common';
import axios from 'axios';

// Make sure to set the SUBSCRIPTION_KEY and REGION environment variables in a .env file (create if does not exist) - see .env.example

@Injectable()
export class Client {
  async requestSpeechToken() {
    const region = process.env.REGION;
    const response = await axios.post(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
      {},
      {
        method: 'POST',
        headers: {'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY},
      }
    );
    return response.data;
  }
}
