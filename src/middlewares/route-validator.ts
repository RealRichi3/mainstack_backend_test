import * as z from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * This function is used to validate the request body against a zod schema.
 * 
 * @param schema Validation schema for the request path.
 * @returns {void}
 */
function routerSchemaValidator(schema: z.AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { body } = await schema.parseAsync({
            body: req.body,
            param: req.params,
            query: req.query,
        })

        req.body = body;

        next();
    }
}

export default routerSchemaValidator;
