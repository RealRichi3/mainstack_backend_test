import { Document } from 'mongoose';

interface IProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}
interface IProductDoc extends IProduct, Document { }

export {
    IProduct,
    IProductDoc
}