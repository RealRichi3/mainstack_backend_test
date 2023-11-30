"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
}, config_1.OPTIONS);
const ProductModel = (0, mongoose_1.model)("Product", ProductSchema);
exports.ProductModel = ProductModel;
