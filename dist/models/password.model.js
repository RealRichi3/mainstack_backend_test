"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongodb_1 = require("../database/mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const password_1 = require("./methods/password");
const passwordSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    password: { type: String, required: true },
}, mongodb_1.collectionOptions);
passwordSchema.pre("save", function (next) {
    if (this.isNew) {
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
});
passwordSchema.methods.updatePassword = password_1.updatePassword;
passwordSchema.methods.comparePassword = password_1.comparePassword;
const PasswordModel = (0, mongoose_1.model)("Password", passwordSchema);
exports.default = PasswordModel;
