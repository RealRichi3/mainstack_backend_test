"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_schema_1 = __importDefault(require("./auth.schema"));
const product_schema_1 = __importDefault(require("./product.schema"));
const user_schema_1 = __importDefault(require("./user.schema"));
class RouteValidatorSchema {
}
RouteValidatorSchema.Auth = auth_schema_1.default;
RouteValidatorSchema.Product = product_schema_1.default;
RouteValidatorSchema.User = user_schema_1.default;
exports.default = RouteValidatorSchema;
