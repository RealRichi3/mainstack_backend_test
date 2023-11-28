import { NextFunction, Request, Response } from "express"
import { AuthenticatedAsyncController, AuthenticatedRequest, TokenPayload } from "../interfaces/auth"
import { AuthTokenCipher, AuthTokenType, AuthorizationUtil } from "../utils/token"
import { UnauthenticatedError } from "../utils/error"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"

const validateAuthHeader = (requiredAuthType: AuthTokenType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer'))
            return next(new Error('Invalid authorization header'));

        const jwtToken = authHeader.split(' ')[1];
        const payload = AuthTokenCipher.decodeToken(jwtToken)

        const tokenData = payload as unknown as TokenPayload & { token: string }
        tokenData.token = jwtToken

        if (tokenData.tokenType !== requiredAuthType) {
            return next(new UnauthenticatedError('Invalid authentication'))
        }

        const validAuthProvided = AuthorizationUtil.verifyToken({ tokenType: requiredAuthType, user: tokenData.user, token: jwtToken })
        if (!validAuthProvided) {
            return next(new UnauthenticatedError('Invalid authentication'))
        };

        (req as AuthenticatedRequest).authPayload = tokenData

        next()
    }
}

export function AuthenticatedController(controller: AuthenticatedAsyncController) {
    return async (req: Request, res: Response, next: NextFunction) => {
        return controller(req as AuthenticatedRequest, res, next)
    }
}