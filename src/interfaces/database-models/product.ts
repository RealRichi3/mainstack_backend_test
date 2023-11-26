import { Types, Document } from 'mongoose';

interface IProduct {
    _id: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}
interface IProductDoc extends Document<IProduct, IProduct, IProduct> { }

export {
    IProduct,
    IProductDoc
}