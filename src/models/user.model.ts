import { Schema, Model, model } from "mongoose";
import { UserRole, IUserDoc, IAdminProfileDoc, ISuperAdminProfileDoc, IEndUserProfileDoc } from "../interfaces/database-models/user";

const UserSchema = new Schema<IUserDoc>({
    _id: Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: String,
    role: {
        type: String,
        enum: Object.values(UserRole),
    },
    accountStatus: {
        emailVerified: Boolean,
        activated: Boolean,
    },
});

const AdminProfileSchema = new Schema<IAdminProfileDoc>({
    _id: Schema.Types.ObjectId,
    role: {
        type: String,
        enum: [UserRole.Admin],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const SuperAdminProfileSchema = new Schema<ISuperAdminProfileDoc>({
    _id: Schema.Types.ObjectId,
    role: {
        type: String,
        enum: [UserRole.SuperAdmin],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const EndUserProfileSchema = new Schema<IEndUserProfileDoc>({
    _id: Schema.Types.ObjectId,
    role: {
        type: String,
        enum: [UserRole.EndUser],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const UserModel : Model<IUserDoc> = model('User', UserSchema);
const AdminProfileModel: Model<IAdminProfileDoc> = model('AdminProfile', AdminProfileSchema);
const SuperAdminProfileModel: Model<ISuperAdminProfileDoc> = model('SuperAdminProfile', SuperAdminProfileSchema);
const EndUserProfileModel: Model<IEndUserProfileDoc> = model('EndUserProfile', EndUserProfileSchema);

export {
    UserRole,
    UserModel,
    AdminProfileModel,
    SuperAdminProfileModel,
    EndUserProfileModel,
};