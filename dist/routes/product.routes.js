"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_validator_1 = __importDefault(require("../middlewares/route-validator"));
const validators_1 = __importDefault(require("./validators"));
const auth_1 = require("../middlewares/auth");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const rbac_handler_1 = __importDefault(require("../middlewares/rbac-handler"));
const token_1 = require("../utils/token");
const router = (0, express_1.Router)();
router
    .post("/create", (0, auth_1.verifyAuth)(token_1.AuthTokenType.Access), (0, rbac_handler_1.default)(['Admin', 'SuperAdmin']), (0, route_validator_1.default)(validators_1.default.Product.createProduct), (0, auth_1.AuthenticatedController)(product_controller_1.default.createProduct))
    .patch("/:productId", (0, auth_1.verifyAuth)(token_1.AuthTokenType.Access), (0, rbac_handler_1.default)(['Admin', 'SuperAdmin']), (0, route_validator_1.default)(validators_1.default.Product.updateProduct), (0, auth_1.AuthenticatedController)(product_controller_1.default.updateProduct))
    .delete("/:productId", (0, auth_1.verifyAuth)(token_1.AuthTokenType.Access), (0, rbac_handler_1.default)(['Admin', 'SuperAdmin']), (0, route_validator_1.default)(validators_1.default.Product.deleteProduct), (0, auth_1.AuthenticatedController)(product_controller_1.default.deleteProduct))
    .get("/:productId", (0, route_validator_1.default)(validators_1.default.Product.getProduct), (0, auth_1.AuthenticatedController)(product_controller_1.default.getProduct))
    .get("/", (0, route_validator_1.default)(validators_1.default.Product.getAllProducts), (0, auth_1.AuthenticatedController)(product_controller_1.default.getAllProducts));
exports.default = router;
