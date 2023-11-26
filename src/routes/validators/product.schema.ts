import * as z from 'zod';

class ProductSchemaValidator {
    static createProduct = z.object({
        body: z.object({
            name: z.string().transform(data => data.trim()),
            price: z.number(),
            quantity: z.number(),
            description: z.string().transform(data => data ? data.trim() : data),
            image: z.string().transform(data => data.trim()),
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
        })
    });
    
    static deleteProduct = z.object({
        params: z.object({
            productId: z.string().uuid(),
        }),
    });

    static getProduct = z.object({
        params: z.object({
            productId: z.string().uuid(),
        }),
    });

    static getAllProducts = z.object({
        query: z.object({
            page: z.number().optional(),
            limit: z.number().optional(),
        }),
    });

}

export default ProductSchemaValidator;