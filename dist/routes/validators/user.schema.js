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
Object.defineProperty(exports, "__esModule", { value: true });
const z = __importStar(require("zod"));
class UserSchemaValidator {
}
UserSchemaValidator.getAllUsers = z.object({
    query: z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
    }),
});
UserSchemaValidator.getUser = z.object({
    params: z.object({
        userId: z.string().uuid(),
    }),
});
UserSchemaValidator.updateUser = z.object({
    body: z.object({
        firstname: z.string().transform(data => data.trim()),
        lastname: z.string().transform(data => data.trim()),
        email: z.string().transform(email => email.trim().toLowerCase()),
        phoneNumber: z.string().transform(phoneNumber => phoneNumber.trim()),
        role: z.enum(['EndUser', 'Admin', 'SuperAdmin']),
    })
});
UserSchemaValidator.deactivateUser = z.object({
    params: z.object({
        userId: z.string().uuid(),
    }),
});
UserSchemaValidator.activateUser = z.object({
    params: z.object({
        userId: z.string().uuid(),
    }),
});
UserSchemaValidator.deleteUser = z.object({
    params: z.object({
        userId: z.string().uuid(),
    }),
});
exports.default = UserSchemaValidator;
