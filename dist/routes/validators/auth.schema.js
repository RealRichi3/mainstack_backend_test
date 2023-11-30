"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const z = __importStar(require("zod"));
const validator_1 = __importDefault(require("../../utils/validator"));
class AuthSchemaValidator {
}
_a = AuthSchemaValidator;
AuthSchemaValidator.validatePassword = (password) => {
    const passwordIsValid = validator_1.default.isPassword(password);
    if (!passwordIsValid) {
        throw new z.ZodError([
            {
                path: ['password'],
                message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
                code: z.ZodIssueCode.custom
            }
        ]);
    }
    return true;
};
AuthSchemaValidator.signup = z.object({
    body: z.object({
        email: z.string().transform(email => email.trim().toLowerCase()),
        firstname: z.string().transform(data => data ? data.trim() : data),
        lastname: z.string().transform(data => data ? data.trim() : data),
        password: z.string().min(8).trim().refine(data => _a.validatePassword(data)),
        role: z.enum(['EndUser', 'Admin', 'SuperAdmin']),
    })
});
AuthSchemaValidator.resendVerificationEmail = z.object({
    query: z.object({
        email: z.string().transform(email => email.trim().toLowerCase()),
    }),
});
AuthSchemaValidator.verifyUserEmail = z.object({
    body: z.object({
        verificationCode: z.number(),
    }),
});
AuthSchemaValidator.forgotPassword = z.object({
    body: z.object({
        email: z.string().transform(email => email.trim().toLowerCase()),
        newPassword: z.string().min(8).trim().refine(data => _a.validatePassword(data)),
    }),
});
AuthSchemaValidator.resetPassword = z.object({
    body: z.object({}),
});
AuthSchemaValidator.activateUserAccount = z.object({
    query: z.object({
        email: z.string().transform(email => email.trim().toLowerCase()),
    }),
});
AuthSchemaValidator.deactivateUserAccount = z.object({
    query: z.object({
        email: z.string().transform(email => email.trim().toLowerCase()),
    }),
});
AuthSchemaValidator.login = z.object({
    body: z.object({
        email: z.string().transform(email => validator_1.default.isEmail(email) ? email.trim().toLowerCase() : email),
        password: z.string().min(8).trim().refine(data => _a.validatePassword(data)),
    })
});
AuthSchemaValidator.refreshToken = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});
exports.default = AuthSchemaValidator;
