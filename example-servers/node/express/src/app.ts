import express, {Express, NextFunction, Response} from 'express';
import {ErrorHandler} from './errorHandler';
import {Client} from './client';
import dotenv from 'dotenv';
import cors from 'cors';

// ------------------ SETUP ------------------

dotenv.config();

const app: Express = express();
const port = 8080;

// this will need to be reconfigured before taking the app to production
app.use(cors());

app.use(express.json());

// ------------------ CONTROLLER ------------------

app.get('/token', async (_, res: Response, next: NextFunction) => {
  Client.requestSpeechToken(res, next);
});

// ------------------ START SERVER ------------------

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// ------------------ ERROR HANDLER ------------------

app.use(ErrorHandler.handle);
