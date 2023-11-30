"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const z = __importStar(require("zod"));
class ProductSchemaValidator {
}
ProductSchemaValidator.createProduct = z.object({
    body: z.object({
        name: z.string().transform(data => data.trim()),
        price: z.number(),
        quantity: z.number(),
        description: z.string().transform(data => data ? data.trim() : data),
        image: z.string().transform(data => data.trim()),
        category: z.string().transform(data => data.trim()),
    })
});
ProductSchemaValidator.bulkCreateProducts = z.object({
    body: z.object({
        products: z.array(z.object({
            name: z.string().transform(data => data.trim()),
            price: z.number(),
            quantity: z.number(),
            description: z.string().transform(data => data ? data.trim() : data),
            image: z.string().transform(data => data.trim()),
        })),
    }),
});
ProductSchemaValidator.updateProduct = z.object({
    body: z.object({
        name: z.string().optional().transform(data => data ? data.trim() : data),
        price: z.number().optional().transform(data => data ? data : data),
        quantity: z.number().optional().transform(data => data ? data : data),
        description: z.string().optional().transform(data => data ? data.trim() : data),
        image: z.string().optional().transform(data => data ? data.trim() : data),
        category: z.string().optional().transform(data => data ? data.trim() : data),
    }),
    param: z.object({
        productId: z.string(),
    }),
});
ProductSchemaValidator.deleteProduct = z.object({
    param: z.object({
        productId: z.string(),
    }),
});
ProductSchemaValidator.getProduct = z.object({
    query: z.object({
        productId: z.string(),
    }),
});
ProductSchemaValidator.getAllProducts = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});
exports.default = ProductSchemaValidator;
