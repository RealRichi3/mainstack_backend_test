import { Model, model, Schema } from "mongoose";
import { IProductDoc } from "../interfaces/database-models/product";

const ProductSchema = new Schema<IProductDoc>({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String,
});

const ProductModel: Model<IProductDoc> = model<IProductDoc>('Product', ProductSchema);

export { ProductModel };