import { NextFunction, Request, Response } from "express";
import { IUserProfile, UserRole } from "./database-models/user";
import { AuthType } from "../utils/token";
import { ValueOf } from "./helper";
import { Types } from "mongoose";

export interface AuthenticatedUser {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
    accountStatus: {
        emailVerified: boolean;
        activated: boolean;
    },
    profile: ValueOf<IUserProfile>
}

export type TokenPayload = { user: AuthenticatedUser; tokenType: AuthType; expiryDate: Date };

export interface AuthenticatedRequest <T extends 'authenticated' | 'partial' = 'authenticated'> extends Request {
    headers: {
        authorization: string;
        signature?: string;
        Signature?: string;
    }
    authPayload: T extends 'partial' ? TokenPayload | undefined : TokenPayload;
}

export type AuthenticatedAsyncController = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;