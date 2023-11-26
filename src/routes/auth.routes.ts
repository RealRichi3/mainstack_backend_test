import { NextFunction, Response, Request, Router } from "express";
import RouteValidatorSchema from "./validators";
import routerSchemaValidator from "../middlewares/route-validator";

const router = Router()

router
    .post('/login', routerSchemaValidator(RouteValidatorSchema.Auth.login), (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send({
            status: 'success',
            message: 'Welcome to the Auth API'
        })
    })

export default router