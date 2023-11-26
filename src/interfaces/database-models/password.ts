import { Document } from "mongoose";
import { Types } from "mongoose";

interface IPassword {
    _id: Types.ObjectId;
    user: Types.ObjectId,
    password: string;
}

interface IPasswordDoc extends Document<IPassword> { }
interface IPasswordWithUser extends IPasswordDoc { user: Types.ObjectId }
interface IPasswordWithUserDoc extends Document<IPasswordWithUser> { }

export {
    IPassword,
    IPasswordDoc,
    IPasswordWithUser,
    IPasswordWithUserDoc
}