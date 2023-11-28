import { NextFunction, Request, Response } from "express";
import { IUserProfile } from "./database-models/user";

export interface AuthenticatedUser {
    _id: string;
    email: string;
    role: string;
    accountStatus: {
        emailVerified: boolean;
        activated: boolean;
    },
    profile: IUserProfile[keyof IUserProfile];
}

export interface AuthenticatedRequest extends Request {
    headers: {
        authorization: string;
        signature?: string;
        Signature?: string;
    }
    user: AuthenticatedUser;
}

export type AuthenticatedAsyncController = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;