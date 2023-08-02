import errorHandler from '../../utils/errorHandler';
import {NextResponse} from 'next/server';

export const config = {
  runtime: 'edge',
};

// Make sure to set the SUBSCRIPTION_KEY and REGION environment variables

async function handler() {
  console.log('Requesting token');

  const region = process.env.REGION;
  const result = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, {
    method: 'POST',
    headers: {'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY},
  });
  if (result.status !== 200) {
    const errorResult = (await result.json()) as {error: {message: string}};
    if (errorResult.error) throw errorResult.error.message;
  }
  return new NextResponse(result.body);
}

export default errorHandler(handler);
