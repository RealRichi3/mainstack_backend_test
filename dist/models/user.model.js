"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserProfileModel = exports.SuperAdminProfileModel = exports.AdminProfileModel = exports.UserModel = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../interfaces/database-models/user");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_1.UserRole; } });
const mongodb_1 = require("../database/mongodb");
const profile_1 = require("./methods/profile");
const UserSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(user_1.UserRole),
        required: true,
    },
    accountStatus: {
        emailVerified: { type: Boolean, required: true },
        activated: { type: Boolean, required: true },
    },
}, mongodb_1.collectionOptions);
UserSchema.methods.getProfile = profile_1.getProfile;
UserSchema.methods.createProfile = profile_1.createProfile;
const AdminProfileSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: [user_1.UserRole.Admin],
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, mongodb_1.collectionOptions);
const SuperAdminProfileSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: [user_1.UserRole.SuperAdmin],
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, mongodb_1.collectionOptions);
const EndUserProfileSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    role: {
        type: String,
        enum: [user_1.UserRole.EndUser],
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, mongodb_1.collectionOptions);
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.UserModel = UserModel;
const AdminProfileModel = (0, mongoose_1.model)("AdminProfile", AdminProfileSchema);
exports.AdminProfileModel = AdminProfileModel;
const SuperAdminProfileModel = (0, mongoose_1.model)("SuperAdminProfile", SuperAdminProfileSchema);
exports.SuperAdminProfileModel = SuperAdminProfileModel;
const EndUserProfileModel = (0, mongoose_1.model)("EndUserProfile", EndUserProfileSchema);
exports.EndUserProfileModel = EndUserProfileModel;
