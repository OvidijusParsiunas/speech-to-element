import {NextFunction, Response} from 'express';
import https from 'https';

// Make sure to set the SUBSCRIPTION_KEY and REGION environment variables in a .env file (create if does not exist) - see .env.example

export class Client {
  public static async requestSpeechToken(res: Response, next: NextFunction) {
    const region = process.env.REGION;
    const req = https.request(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
      {
        method: 'POST',
        headers: {'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY},
      },
      (reqResp) => {
        let data = '';
        reqResp.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
        reqResp.on('data', (chunk) => {
          data += chunk;
        });
        reqResp.on('end', () => {
          if (reqResp.statusCode !== 200) {
            const result = JSON.parse(data);
            if (result.error) {
              return next(result.error.message); // forwarded to error handler middleware in ErrorUtils.handle
            }
          }
          res.send(data);
        });
      }
    );
    req.on('error', next); // forwarded to error handler middleware in ErrorUtils.handle
    // Send the chat request to openAI
    req.end();
  }
}
