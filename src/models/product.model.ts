import { Model, model, Schema } from "mongoose";
import { IProductDoc } from "../interfaces/database-models/product";

const ProductSchema = new Schema<IProductDoc>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
});

const ProductModel: Model<IProductDoc> = model<IProductDoc>('Product', ProductSchema);

export { ProductModel };