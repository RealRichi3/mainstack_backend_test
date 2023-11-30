import { NextFunction, Request, Response } from "express"
import { AuthenticatedAsyncController, AuthenticatedRequest, TokenPayload } from "../interfaces/auth"
import { AuthTokenCipher, AuthTokenType, AuthorizationUtil } from "../utils/token"
import { UnauthenticatedError } from "../utils/error"

export const verifyAuth = (requiredAuthType: AuthTokenType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader?.startsWith('Bearer')) {
            return next(new UnauthenticatedError('Invalid authorization header'));
        }

        const jwtToken = authHeader.split(' ')[1];
        const payload = await AuthTokenCipher.decodeToken(jwtToken)

        const tokenData = payload as unknown as TokenPayload & { token: string }
        tokenData.token = jwtToken

        if (tokenData.tokenType !== requiredAuthType) {
            return next(new UnauthenticatedError('Invalid authentication'))
        }

        /**
         * In some cases the JWT token expiry date is not set
         * Or the expiry can be set to a later date
         * 
         * But each token has a expiry date set in the payload
         * In validations we'll use the expiry date set in the payload
         */
        const tokenExpiry = new Date(tokenData.expiryDate).getTime()
        const currentTime = new Date().getTime()
        if (tokenExpiry < currentTime) {
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