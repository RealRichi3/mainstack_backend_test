import { NextFunction, Request, Response } from "express"
import { AuthenticatedAsyncController, AuthenticatedRequest } from "../interfaces/auth"

export function AuthenticatedController(controller: AuthenticatedAsyncController) {
    return async (req: Request, res: Response, next: NextFunction) => {
        return controller(req as AuthenticatedRequest, res, next)
    }
}