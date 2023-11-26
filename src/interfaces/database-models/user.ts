import { Types, Document, Model } from 'mongoose';

enum UserRole {
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin',
    EndUser = 'EndUser',
}

interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
    accountStatus: {
        emailVerified: boolean;
        activated: boolean;
    }
}
interface IUserDoc extends IUser, Document { }

interface IAdminProfile extends IUser {
    role: UserRole.Admin;
    user: Types.ObjectId;
}
interface IAdminProfileDoc extends IAdminProfile, Document { }

interface ISuperAdminProfile extends IUser {
    role: UserRole.SuperAdmin;
    user: Types.ObjectId;
}
interface ISuperAdminProfileDoc extends ISuperAdminProfile, Document { }

interface IEndUserProfile extends IUser {
    role: UserRole.EndUser;
    user: Types.ObjectId;
}
interface IEndUserProfileDoc extends IEndUserProfile, Document { }

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

