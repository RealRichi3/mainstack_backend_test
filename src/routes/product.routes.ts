import { Router } from "express";
import routerSchemaValidator from "../middlewares/route-validator";
import RouteValidatorSchema from "./validators";
import { AuthenticatedController } from "../middlewares/auth";
import ProductController from "../controllers/product.controller";
import permit from "../middlewares/rbac-handler";

const router = Router();

router
    .post(
        "/create",
        permit(['Admin', 'SuperAdmin']),
        routerSchemaValidator(RouteValidatorSchema.Product.createProduct),
        AuthenticatedController(ProductController.createProduct)
    )
    .patch(
        "/:productId",
        permit(['Admin', 'SuperAdmin']),
        routerSchemaValidator(RouteValidatorSchema.Product.updateProduct),
        AuthenticatedController(ProductController.updateProduct)
    )
    .delete(
        "/:productId",
        permit(['Admin', 'SuperAdmin']),
        routerSchemaValidator(RouteValidatorSchema.Product.deleteProduct),
        AuthenticatedController(ProductController.deleteProduct)
    )
    .get(
        "/:productId",
        routerSchemaValidator(RouteValidatorSchema.Product.getProduct),
        AuthenticatedController(ProductController.getProduct)
    )
    .get(
        "/",
        routerSchemaValidator(RouteValidatorSchema.Product.getAllProducts),
        AuthenticatedController(ProductController.getAllProducts)
    );

export default router;
