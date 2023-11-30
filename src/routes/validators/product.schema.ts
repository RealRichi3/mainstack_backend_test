import * as z from 'zod';

class ProductSchemaValidator {
    static createProduct = z.object({
        body: z.object({
            name: z.string().transform(data => data.trim()),
            price: z.number(),
            quantity: z.number(),
            description: z.string().transform(data => data ? data.trim() : data),
            image: z.string().transform(data => data.trim()),
            category: z.string().transform(data => data.trim()),
        })
    });
    
    static bulkCreateProducts = z.object({
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

    static updateProduct = z.object({
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
    
    static deleteProduct = z.object({
        param: z.object({
            productId: z.string(),
        }),
    });

    static getProduct = z.object({
        query: z.object({
            productId: z.string(),
        }),
    });

    static getAllProducts = z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    });

}

export default ProductSchemaValidator;