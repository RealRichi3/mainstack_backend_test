import { IUserDoc, IUserProfile, IUserProfileDoc, UserRole } from "../../interfaces/database-models/user";
import { ValueOf } from "../../interfaces/helper";
import { AdminProfileModel, EndUserProfileModel, SuperAdminProfileModel } from "../user.model";

export async function getProfile(this: IUserDoc): Promise<IUserProfileDoc<UserRole>> {
    let userProfile: IUserProfileDoc<UserRole> | null = null;

    switch (this.role) {
        case UserRole.Admin:
            userProfile = await AdminProfileModel.findOne({ user: this._id });
        case UserRole.SuperAdmin:
            userProfile = await SuperAdminProfileModel.findOne({ user: this._id });
        case UserRole.EndUser:
            userProfile = await EndUserProfileModel.findOne({ user: this._id });
    }

    if (!userProfile) {
        throw new Error('User profile not found');
    }

    return userProfile;
}