import { Router } from "express";
import routerSchemaValidator from "../middlewares/route-validator";
import RouteValidatorSchema from "./validators";
import { AuthenticatedController, verifyAuth } from "../middlewares/auth";
import ProductController from "../controllers/product.controller";
import permit from "../middlewares/rbac-handler";
import { AuthTokenType } from "../utils/token";

const router = Router();

router
    .post(
        "/create",
        verifyAuth(AuthTokenType.Access),
        permit(['Admin', 'SuperAdmin']),
        routerSchemaValidator(RouteValidatorSchema.Product.createProduct),
        AuthenticatedController(ProductController.createProduct)
    )
    .patch(
        "/:productId",
        verifyAuth(AuthTokenType.Access),
        permit(['Admin', 'SuperAdmin']),
        routerSchemaValidator(RouteValidatorSchema.Product.updateProduct),
        AuthenticatedController(ProductController.updateProduct)
    )
    .delete(
        "/:productId",
        verifyAuth(AuthTokenType.Access),
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
