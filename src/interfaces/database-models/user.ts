import { Types, Document, Model } from 'mongoose';

enum UserRole {
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin',
    EndUser = 'EndUser',
}

interface IUser {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
    accountStatus: {
        emailVerified: boolean;
        activated: boolean;
    }
}
interface IUserDoc extends Document<IUser> { }

interface IAdminProfile extends IUser {
    _id: Types.ObjectId;
    role: UserRole.Admin;
    user: Types.ObjectId;
}
interface IAdminProfileDoc extends Document<IAdminProfile> { }

interface ISuperAdminProfile extends IUser {
    _id: Types.ObjectId;
    role: UserRole.SuperAdmin;
    user: Types.ObjectId;
}
interface ISuperAdminProfileDoc extends Document<ISuperAdminProfile> { }

interface IEndUserProfile extends IUser {
    _id: Types.ObjectId;
    role: UserRole.EndUser;
    user: Types.ObjectId;
}
interface IEndUserProfileDoc extends Document<IEndUserProfile> { }

interface IUserProfile {
    Admin: IAdminProfile;
    SuperAdmin: ISuperAdminProfile;
    EndUser: IEndUserProfile;
}

type UserProfile<R extends UserRole> = IUserProfile[R];
type IUserProfileDoc<R extends UserRole> = UserProfile<R> & Document & {}

export {
    IUser,
    IUserDoc,
    IUserProfile,
    IUserProfileDoc,
    IAdminProfile,
    IAdminProfileDoc,
    ISuperAdminProfile,
    ISuperAdminProfileDoc,
    IEndUserProfile,
    IEndUserProfileDoc,
    UserRole
}

