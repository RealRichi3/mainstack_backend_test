import { IUserProfile } from "./database-models/user";

interface AuthenticatedUser {
    _id: string;
    email: string;
    role: string;
    accountStatus: {
        emailVerified: boolean;
        activated: boolean;
    },
    profile: IUserProfile[keyof IUserProfile];
}

export {
    AuthenticatedUser
}