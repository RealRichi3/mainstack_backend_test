"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = exports.getProfile = void 0;
const mongodb_1 = require("mongodb");
const user_model_1 = require("../user.model");
function getProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        let userProfile = null;
        if (this.role === 'SuperAdmin') {
            userProfile = yield user_model_1.SuperAdminProfileModel.findOne({ user: this._id });
        }
        else if (this.role === 'Admin') {
            userProfile = yield user_model_1.AdminProfileModel.findOne({ user: this._id });
        }
        else if (this.role === 'EndUser') {
            userProfile = yield user_model_1.EndUserProfileModel.findOne({ user: this._id });
        }
        else {
            throw new Error("Invalid user role");
        }
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        return userProfile;
    });
}
exports.getProfile = getProfile;
function createProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        let userProfile;
        const session = this.$session();
        if (this.role === 'SuperAdmin') {
            userProfile = session
                ? yield user_model_1.SuperAdminProfileModel.create([{ _id: new mongodb_1.ObjectId(), user: this._id, role: this.role }], { session }).then((r) => r[0])
                : yield user_model_1.SuperAdminProfileModel.create({
                    _id: new mongodb_1.ObjectId(), user: this._id,
                    role: this.role,
                });
        }
        else if (this.role === 'Admin') {
            userProfile = session
                ? yield user_model_1.AdminProfileModel.create([{ _id: new mongodb_1.ObjectId(), user: this._id, role: this.role }], { session }).then((r) => r[0])
                : yield user_model_1.AdminProfileModel.create({ _id: new mongodb_1.ObjectId(), user: this._id, role: this.role });
        }
        else if (this.role === 'EndUser') {
            userProfile = session
                ? yield user_model_1.EndUserProfileModel.create([{ _id: new mongodb_1.ObjectId(), user: this._id, role: this.role }], { session }).then((r) => r[0])
                : yield user_model_1.EndUserProfileModel.create({ _id: new mongodb_1.ObjectId(), user: this._id, role: this.role });
        }
        else {
            throw new Error("Invalid user role");
        }
        return userProfile;
    });
}
exports.createProfile = createProfile;
