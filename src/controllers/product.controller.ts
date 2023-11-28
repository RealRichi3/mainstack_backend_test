import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import { NotFoundError } from '../utils/error';

class ProductController {
    static async createProduct(req: Request, res: Response) {
        const product = await ProductModel.create(req.body);
        res.status(201).json(product);
    }

    static async getProduct(req: Request, res: Response) {
        const product = await ProductModel.findById(req.params.productId);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        res.status(200).json(product);
    }

    static async updateProduct(req: Request, res: Response) {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        );

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        res.status(200).json(product);
    }

    static async deleteProduct(req: Request, res: Response) {
        const product = await ProductModel.findByIdAndDelete(req.params.productId);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        res.status(204).send();
    }

    static async getAllProducts(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query as unknown as { page: number, limit: number };
        const skip = (page - 1) * limit;

        const products = await ProductModel.find()
            .skip(skip)
            .limit(limit)
            .exec();

        res.status(200).json(products);
    }
}

export default ProductController;
