import { Model, Schema, model } from "mongoose";
import { IPasswordDoc } from "../interfaces/database-models/password";
import { OPTIONS } from "./config";

const passwordSchema = new Schema<IPasswordDoc>({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    password: { type: String, required: true },
}, OPTIONS);

const PasswordModel: Model<IPasswordDoc> = model<IPasswordDoc>('Password', passwordSchema);

export { PasswordModel };

