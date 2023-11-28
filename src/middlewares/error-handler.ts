import { Request, Response, NextFunction } from 'express';
import { CustomAPIError } from '../utils/error';
import logger from './logger';
import { ZodError } from 'zod';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response {
    // console.error(err)
    logger.error(err.stack);
    if (err instanceof CustomAPIError && err.statusCode !== 500) {
        return res.status(err.statusCode).send({
            status: 'error',
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).send({
            status: 'error',
            errors: err.errors,
            message: 'Validation Error',
        });
    }

    // if the error is not one of the specific types above, return a generic internal server error
    return res.status(500).send({ status: 'error', message: 'Ops, Something went wrong' });
}

export default errorHandler;
