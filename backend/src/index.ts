import express, { Request, Response, NextFunction } from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';

import { logger } from './utils/logger.js';
import { connectToDatabase } from './utils/db/connectToDatabase.js';
import { ExpressError } from './utils/ExpressError.js';
import { authRouter } from './routes/auth.routes.js';

const app = express();
const port = config.get<number>('port') || 3000;
const dbUri = config.get<string>('dbUri');

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

//Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ExpressError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  if (req.accepts('html')) {
    res.status(statusCode).send(`${statusCode} - ${message}`);
  } else {
    res.status(statusCode).json({ error: message });
  }
});

try {
  await connectToDatabase(dbUri);
  logger.info('DATABASE CONNECTED');

  app.listen(port, () => {
    logger.info(`APP RUNNING AT http://localhost:${port}`);
  });
} catch (error) {
  logger.error('DATABASE CONNECTION FAILED');
  process.exit(1);
}
