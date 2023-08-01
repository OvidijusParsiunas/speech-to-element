import errorHandler from '../../utils/errorHandler';
import {NextResponse} from 'next/server';

export const config = {
  runtime: 'edge',
};

// Make sure to set the SUBSCRIPTION_KEY environment variable

async function handler() {
  console.log('Requesting token');

  const region = 'eastus';
  const result = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, {
    method: 'POST',
    headers: {'Ocp-Apim-Subscription-Key': '4fe9718dfa49485a96cf44ebd2ab482f'},
  });
  if (result.status !== 200) {
    const errorResult = (await result.json()) as {error: {message: string}};
    if (errorResult.error) throw errorResult.error.message;
  }
  return new NextResponse(result.body);
}

export default errorHandler(handler);
