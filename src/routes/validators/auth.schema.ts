import * as z from 'zod';
import Validator from '../../utils/validator';

class AuthSchemaValidator {
    private static validatePassword = (password: string) => {
        const passwordIsValid = Validator.isPassword(password);
        if (!passwordIsValid) {
            throw new z.ZodError([
                {
                    path: ['password'],
                    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
                    code: z.ZodIssueCode.custom
                }
            ])
        }
    }
    static userSignup = z.object({
        body: z.object({
            email: z.string().transform(email => email.trim().toLowerCase()),
            firstname: z.string().transform(data => data ? data.trim() : data),
            lastname: z.string().transform(data => data ? data.trim() : data),
            password: z.string().min(8).trim().refine(data => this.validatePassword(data)),
            role: z.enum(['EndUser', 'Admin', 'SuperAdmin']),
        })
    });

    static resendVerificationEmail = z.object({
        query: z.object({
            email: z.string().transform(email => email.trim().toLowerCase()),
        }),
    });

    static verifyUserEmail = z.object({
        body: z.object({
            verificationCode: z.number(),
        }),
    });

    static forgotPassword = z.object({
        body: z.object({
            email: z.string().transform(email => email.trim().toLowerCase()),
        }),
    });

    static resetPassword = z.object({
        body: z.object({
            newPassword: z.string().min(8).trim().refine(data => this.validatePassword(data)),
            passwordResetCode: z.number(),
        }),
    });

    static activateUserAccount = z.object({
        query: z.object({
            email: z.string().transform(email => email.trim().toLowerCase()),
        }),
    });

    static deactivateUserAccount = z.object({
        query: z.object({
            email: z.string().transform(email => email.trim().toLowerCase()),
        }),
    });

    static login = z.object({
        body: z.object({
            email: z.string().transform(email => Validator.isEmail(email)),
            password: z.string().min(8).trim().refine(data => this.validatePassword(data)),
        })
    });
}

export default AuthSchemaValidator;
