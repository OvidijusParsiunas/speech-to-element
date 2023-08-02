import {NextRequest, NextResponse} from 'next/server';

type CallbackFunc = (req: NextRequest, res: NextResponse) => Promise<NextResponse<String>> | Promise<Response>;

export default function errorHandler(callbacFunc: CallbackFunc) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      return await callbacFunc(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return new NextResponse(error, {status: 500});
    }
  };
}
