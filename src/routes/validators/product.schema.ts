import * as z from 'zod';

class ProductSchemaValidator {
    static createProduct = z.object({
        body: z.object({
            name: z.string().transform(data => data ? data.trim() : data),
            price: z.number().transform(data => data ? data : data),
            quantity: z.number().transform(data => data ? data : data),
            description: z.string().transform(data => data ? data.trim() : data),
            image: z.string().transform(data => data ? data.trim() : data),
        })
    });
    static updateProduct = z.object({
        body: z.object({
            name: z.string().transform(data => data ? data.trim() : data),
            price: z.number().transform(data => data ? data : data),
            quantity: z.number().transform(data => data ? data : data),
            description: z.string().transform(data => data ? data.trim() : data),
            image: z.string().transform(data => data ? data.trim() : data),
        })
    });
    static deleteProduct = z.object({
        params: z.object({
            productId: z.string().uuid(),
        }),
    });;
    static getProduct = z.object({
        params: z.object({
            productId: z.string().uuid(),
        }),
    });;
    static getAllProducts = z.object({
        query: z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
        }),
    });;
}

export default ProductSchemaValidator;