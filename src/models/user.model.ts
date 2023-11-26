import { Schema, Model, model } from "mongoose";
import { UserRole, IUserDoc, IAdminProfileDoc, ISuperAdminProfileDoc, IEndUserProfileDoc } from "../interfaces/database-models/user";

const UserSchema = new Schema<IUserDoc>({
    _id: { type: Schema.Types.ObjectId, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
    },
    accountStatus: {
        emailVerified: { type: Boolean, required: true },
        activated: { type: Boolean, required: true },
    },
});

const AdminProfileSchema = new Schema<IAdminProfileDoc>({
    _id: { type: Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: [UserRole.Admin],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const SuperAdminProfileSchema = new Schema<ISuperAdminProfileDoc>({
    _id: { type: Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: [UserRole.SuperAdmin],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const EndUserProfileSchema = new Schema<IEndUserProfileDoc>({
    _id: { type: Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: [UserRole.EndUser],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});


const UserModel: Model<IUserDoc> = model('User', UserSchema);
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