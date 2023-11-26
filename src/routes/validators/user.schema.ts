import * as z from 'zod';

class UserSchemaValidator {
    static getAllUsers = z.object({
        query: z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
        }),
    });

    static getUser = z.object({
        params: z.object({
            userId: z.string().uuid(),
        }),
    });

    static updateUser = z.object({
        body: z.object({
            firstname: z.string().transform(data => data.trim()),
            lastname: z.string().transform(data => data.trim()),
            email: z.string().transform(email => email.trim().toLowerCase()),
            phoneNumber: z.string().transform(phoneNumber => phoneNumber.trim()),
            role: z.enum(['EndUser', 'Admin', 'SuperAdmin']),
        })
    });

    static deactivateUser = z.object({
        params: z.object({
            userId: z.string().uuid(),
        }),
    });

    static activateUser = z.object({
        params: z.object({
            userId: z.string().uuid(),
        }),
    });

    static deleteUser = z.object({
        params: z.object({
            userId: z.string().uuid(),
        }),
    });
}

export default UserSchemaValidator;