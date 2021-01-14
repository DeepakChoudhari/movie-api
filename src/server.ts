import { EOL } from 'os';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/logger';
import { ValidationError } from 'express-json-validator-middleware';

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    morgan.format('morgan-development', '[:date[clf]] ":method :url" :status :res[content-length] - :response-time ms');
    app.use(morgan('morgan-development'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api/v1', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        logger.err(`Validaton errors occurred: ${JSON.stringify(err)}`);
        return res.status(StatusCodes.BAD_REQUEST).json(err);
    } else {
        logger.err(`Unhandled exception occurred - ${err.message} ${EOL} ${err.stack}`, true);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err.message,
        });
    }
});

// Export express instance
export default app;
