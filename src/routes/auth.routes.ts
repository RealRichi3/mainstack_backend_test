import { NextFunction, Response, Request, Router } from "express";
import RouteValidatorSchema from "./validators";
import routerSchemaValidator from "../middlewares/route-validator";
import AuthController from "../controllers/auth.controller";
import { AuthenticatedController, verifyAuth } from "../middlewares/auth";
import { AuthTokenType } from "../utils/token";

const router = Router()

router
    .post('/login', routerSchemaValidator(RouteValidatorSchema.Auth.login), AuthController.login)
    .post('/signup', routerSchemaValidator(RouteValidatorSchema.Auth.signup), AuthController.signup)
    .post('/reset-password', routerSchemaValidator(RouteValidatorSchema.Auth.forgotPassword), AuthController.forgotPassword)
    .post('/logout', verifyAuth(AuthTokenType.Access), AuthenticatedController(AuthController.logout))
    .post('/refresh', routerSchemaValidator(RouteValidatorSchema.Auth.refreshToken), verifyAuth(AuthTokenType.Refresh), AuthenticatedController(AuthController.refreshToken))

export default router