import { Router } from "express";
import routerSchemaValidator from "../middlewares/route-validator";
import RouteValidatorSchema from "./validators";
import { AuthenticatedController } from "../middlewares/auth";
import ProductController from "../controllers/product.controller";

const router = Router()

router
    .post('/create', routerSchemaValidator(RouteValidatorSchema.Product.createProduct), AuthenticatedController(ProductController.createProduct))
    .patch('/:productId', routerSchemaValidator(RouteValidatorSchema.Product.updateProduct), AuthenticatedController(ProductController.updateProduct))
    .delete('/:productId', routerSchemaValidator(RouteValidatorSchema.Product.deleteProduct), AuthenticatedController(ProductController.deleteProduct))
    .get('/:productId', routerSchemaValidator(RouteValidatorSchema.Product.getProduct), AuthenticatedController(ProductController.getProduct))
    .get('/', routerSchemaValidator(RouteValidatorSchema.Product.getAllProducts), AuthenticatedController(ProductController.getAllProducts))

export default router