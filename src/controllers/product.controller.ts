// productController.ts

import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import { NotFoundError, BadRequestError } from '../utils/error';

class ProductController {
    static async createProduct(req: Request, res: Response) {
        const product = await ProductModel.create(req.body);
        return res.status(201).json(product);
    }

    static async getProduct(req: Request, res: Response) {
        const product = await ProductModel.findById(req.params.productId);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return res.status(200).json(product);
    }

    // Add other CRUD operations as needed
}

export default ProductController;
