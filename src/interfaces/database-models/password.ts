import { Document } from "mongoose";
import { Types } from "mongoose";
import { IUserDoc } from "./user";

interface IPassword {
    user: Types.ObjectId,
    password: string;
}

interface IPasswordDoc extends IPassword, Document { }
interface IPasswordWithUserDoc extends Omit<IPasswordDoc, 'user'> { user: IUserDoc }

export {
    IPassword,
    IPasswordDoc,
    IPasswordWithUserDoc,
}