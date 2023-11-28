import { Model, Schema, model } from "mongoose";
import { IPasswordDoc } from "../interfaces/database-models/password";
import { collectionOptions } from "../database/mongodb";
import bcrypt from 'bcrypt'
import { comparePassword, updatePassword } from "./methods/password";

const passwordSchema = new Schema<IPasswordDoc>({
    _id: { type: Schema.Types.ObjectId, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    password: { type: String, required: true },
}, collectionOptions)

passwordSchema.pre<IPasswordDoc>('save', function (next) {
    if (this.isNew) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
})

passwordSchema.methods.updatePassword = updatePassword
passwordSchema.methods.comparePassword = comparePassword

const PasswordModel: Model<IPasswordDoc> = model<IPasswordDoc>('Password', passwordSchema)

export default PasswordModel
