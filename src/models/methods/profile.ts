import { ObjectId } from "mongodb";
import {
    IUserDoc,
    IUserProfile,
    IUserProfileDoc,
    UserRole,
} from "../../interfaces/database-models/user";
import { ValueOf } from "../../interfaces/helper";
import {
    AdminProfileModel,
    EndUserProfileModel,
    SuperAdminProfileModel,
} from "../user.model";

export async function getProfile(
    this: IUserDoc
): Promise<IUserProfileDoc<UserRole>> {
    let userProfile: IUserProfileDoc<UserRole> | null = null;

    if (this.role === 'SuperAdmin') {
        userProfile = await SuperAdminProfileModel.findOne({ user: this._id });
    } else if (this.role === 'Admin') {
        userProfile = await AdminProfileModel.findOne({ user: this._id });
    } else if (this.role === 'EndUser') {
        userProfile = await EndUserProfileModel.findOne({ user: this._id });
    } else {
        throw new Error("Invalid user role");
    }
    
    if (!userProfile) {
        throw new Error("User profile not found");
    }

    return userProfile;
}

export async function createProfile(
    this: IUserDoc
): Promise<IUserProfileDoc<UserRole>> {
    let userProfile: IUserProfileDoc<UserRole>;

    const session = this.$session();
    if (this.role === 'SuperAdmin') {
        userProfile = session
            ? await SuperAdminProfileModel.create(
                [{ _id: new ObjectId(), user: this._id, role: this.role }],
                { session }
            ).then((r) => r[0])
            : await SuperAdminProfileModel.create({
                _id: new ObjectId(), user: this._id,
                role: this.role,
            });
    } else if (this.role === 'Admin') {
        userProfile = session
            ? await AdminProfileModel.create(
                [{ _id: new ObjectId(), user: this._id, role: this.role }],
                { session }
            ).then((r) => r[0])
            : await AdminProfileModel.create({ _id: new ObjectId(), user: this._id, role: this.role });
    } else if (this.role === 'EndUser') {
        userProfile = session
            ? await EndUserProfileModel.create(
                [{ _id: new ObjectId(), user: this._id, role: this.role }],
                { session }
            ).then((r) => r[0])
            : await EndUserProfileModel.create({ _id: new ObjectId(), user: this._id, role: this.role });
    } else {
        throw new Error("Invalid user role");
    }

    return userProfile;
}
