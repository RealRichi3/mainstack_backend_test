import { Request, Response, Router } from "express";
import routerSchemaValidator from "../middlewares/route-validator";
import RouteValidatorSchema from "./validators";

const router = Router()

router
    .post('/create', routerSchemaValidator(RouteValidatorSchema.Product.createProduct), (req: Request, res: Response) => {
        res.status(200).send({
            status: 'success',
            message: 'Welcome to the Product API'
        })
    })

export default router