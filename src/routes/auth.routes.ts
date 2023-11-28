import { NextFunction, Response, Request, Router } from "express";
import RouteValidatorSchema from "./validators";
import routerSchemaValidator from "../middlewares/route-validator";
import AuthController from "../controllers/auth.controller";
import { AuthenticatedController } from "../middlewares/auth";

const router = Router()

router
    .post('/login', routerSchemaValidator(RouteValidatorSchema.Auth.login),  AuthController.login)
    .post('/signup', routerSchemaValidator(RouteValidatorSchema.Auth.signup), AuthController.signup)
    .post('/reset-password', routerSchemaValidator(RouteValidatorSchema.Auth.forgotPassword), AuthController.forgotPassword)
    .post('/logout', AuthenticatedController(AuthController.logout))
    .post('/refresh', routerSchemaValidator(RouteValidatorSchema.Auth.refreshToken), AuthenticatedController(AuthController.refreshToken))

export default router