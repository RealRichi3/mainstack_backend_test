import { Request, Response, NextFunction } from 'express';
import logger from "./logger";
import { randomUUID } from 'crypto';
import { AuthenticatedRequest } from '../interfaces/auth';

export const requestResponseLogger = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const requestId = randomUUID(); // Generate a unique request ID
    res.locals.request_ref_id = requestId; // Set the request ID on the response object to be used in the response logger

    const requestDetails = {
        resource: req.method + " " + req.originalUrl,
        user: req.user?.email,
        // query: req.query,
        body: req.body,
        timestamp: new Date().toISOString(),
        request_ref_id: requestId,
    };
    logger.info('Request', { meta: requestDetails });

    const originalSend = res.send.bind(res);
    res.send = function (data: any) {
        res.locals.data = data;
        originalSend(data);
    } as any

    res.on("finish", () => {
        const responseDetails = {
            status: res.statusCode,
            user: req.user?.email,
            message: res.statusMessage,
            timestamp: new Date().toISOString(),
            data: JSON.parse(res.locals.data),
            request_ref_id: requestDetails.request_ref_id,
        };

        logger.info('Response', { meta: responseDetails });
    });

    next();
}

export default requestResponseLogger;



