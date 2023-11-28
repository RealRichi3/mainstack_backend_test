import { Document } from "mongoose";
import { Types } from "mongoose";
import { comparePassword, updatePassword } from "../../models/methods/password";
import { IUserDoc } from "./user";

interface IPassword {
    user: Types.ObjectId,
    password: string;
}

interface IPasswordMethods {
    updatePassword: typeof updatePassword 
    comparePassword: typeof comparePassword 
}

interface IPasswordDoc extends IPassword, IPasswordMethods, Document { }
interface IPasswordWithUser extends Omit<IPasswordDoc, 'user'> { user: IUserDoc }

export {
    IPassword,
    IPasswordDoc,
    IPasswordWithUser,
}