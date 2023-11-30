"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = require("../models/product.model");
const error_1 = require("../utils/error");
class ProductController {
    static createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.ProductModel.create(req.body);
            res.status(201).json({
                status: 'success',
                message: 'Product created succesfully',
                data: {
                    product
                }
            });
        });
    }
    static getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.ProductModel.findById(req.query.productId);
            if (!product) {
                throw new error_1.NotFoundError("Product not found");
            }
            res.status(200).json({
                status: 'success',
                message: 'Product fetched successfully',
                data: {
                    product
                }
            });
        });
    }
    static getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const products = yield product_model_1.ProductModel.find().skip(skip).limit(limit).exec();
            res.status(200).json({
                status: 'success',
                message: 'Products fetched successfully',
                data: {
                    products
                }
            });
        });
    }
    static updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.ProductModel.findByIdAndUpdate(req.params.productId, req.body, { new: true });
            if (!product) {
                throw new error_1.NotFoundError("Product not found");
            }
            res.status(200).json({
                status: 'success',
                message: 'Product updated successfully',
                data: {
                    product
                }
            });
        });
    }
    static deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.ProductModel.findByIdAndDelete(req.params.productId);
            if (!product) {
                throw new error_1.NotFoundError("Product not found");
            }
            res.status(200).send({
                status: 'success',
                message: 'Product deleted successfully',
                data: null
            });
        });
    }
}
exports.default = ProductController;
