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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const error_1 = require("../utils/error");
const mongoose_1 = __importDefault(require("mongoose"));
const password_model_1 = __importDefault(require("../models/password.model"));
const token_1 = require("../utils/token");
const validator_1 = __importDefault(require("../utils/validator"));
const mongodb_1 = require("mongodb");
// Some of the vaidation logic will be moved to the zod validation schema
class AuthValidator {
    static validateSignup({ email, role, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(user_model_1.UserRole).includes(role)) {
                throw new error_1.BadRequestError("Invalid user role");
            }
            // Check if the email is already registered
            const existingUser = yield user_model_1.UserModel.findOne({ email });
            if (existingUser) {
                throw new error_1.BadRequestError("Email is already registered");
            }
            return null; // No validation errors
        });
    }
    static validateLogin({ email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new error_1.BadRequestError("Incorrect email or password");
            }
            if (!user.accountStatus.activated) {
                throw new error_1.BadRequestError("Your account has not been activated");
            }
            const userPassword = yield password_model_1.default.findOne({ user: user._id });
            if (!userPassword) {
                throw new error_1.BadRequestError("Invalid email or password");
            }
            const passwordMatch = yield userPassword.comparePassword(password);
            if (!passwordMatch) {
                throw new error_1.BadRequestError("Incorrect email or password");
            }
            return { user }; // No validation errors
        });
    }
    static validateForgotPassword({ email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new error_1.BadRequestError("Incorrect email");
            }
            const validPassword = validator_1.default.isPassword(password);
            if (!validPassword) {
                throw new error_1.BadRequestError("Invalid password");
            }
            return { user }; // No validation errors
        });
    }
}
class AuthController {
    /**
     * Login
     *
     * @param req.body.email - the user's email
     * @param req.body.password - the user's password
     */
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const { user } = yield AuthValidator.validateLogin({ email, password });
            // All generated tokens are stored in cache
            // The cache is used to verify the tokens
            // Only one active token is allowed per user i.e. if a new token of the same type is generated, the old token is invalidated
            const accessToken = yield token_1.AuthorizationUtil.generateToken({
                user,
                tokenType: token_1.AuthTokenType.Access,
                expiry: 3 * 60 * 60,
            });
            const refreshToken = yield token_1.AuthorizationUtil.generateToken({
                user,
                tokenType: token_1.AuthTokenType.Refresh,
                expiry: 7 * 24 * 60 * 60,
            });
            res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            });
        });
    }
    /**
     * Signup
     *
     * @description Signup flow should require some form of verification,
     * i.e OTP code sent to email or phone number
     * but for the scope of this project, we will just assume that the user has access to the email
     *
     * @param req.body.email - the user's email
     * @param req.body.password - the user's password
     */
    static signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Signup flow should require some form of verification,
             * But for the scope of this project, we will just assume that the user has access to the email
             */
            const { firstname, lastname, email, password, role } = req.body;
            /**
             * Validate the request body
             *
             * This is different from the validation done by the schema AuthValidator middleware.
             * The schema AuthValidator middleware validates the request body against a zod schema.
             *
             * This validation goes further, in come cases, it checks if the email is already registered
             * Basically it checks if the data is valid for the database
             */
            yield AuthValidator.validateSignup({
                firstname,
                lastname,
                email,
                password,
                role,
            });
            const session = yield mongoose_1.default.connection.startSession();
            session.startTransaction();
            // Create a new user
            const newUser = yield user_model_1.UserModel.create([
                {
                    _id: new mongodb_1.ObjectId(),
                    firstname,
                    lastname,
                    email,
                    role,
                    accountStatus: { emailVerified: false, activated: true }, // All accounts will be activated by default for now
                },
            ], { session });
            // Create a profile for user
            // Each user has a profile,
            // The profile depends on the user's role i.e (EndUserProfile, AdminProfile, SuperAdminProfile)
            // This is done to allow for extension of data without having to alter the existing schema
            // This will allow different types of users. i.e CustomerSupportAdmin, Marketer e.t.c
            yield newUser[0].createProfile();
            yield password_model_1.default.create([
                {
                    _id: new mongodb_1.ObjectId(),
                    user: newUser[0]._id,
                    password,
                },
            ], { session });
            yield session.commitTransaction();
            yield session.endSession();
            res
                .status(201)
                .json({
                status: "success",
                message: "Signup successful",
                data: { user: newUser[0] },
            });
        });
    }
    /**
     * Logout
     *
     * @description Removes the user's access and refresh tokens from the cache
     *
     * @param req.body.refreshToken - the user's refresh token
     */
    static logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findById(req.authPayload.user._id);
            if (!user) {
                throw new error_1.InternalServerError("User record not found for authenticated request");
            }
            yield token_1.AuthorizationUtil.clearAuthorization({
                user,
                tokenType: token_1.AuthTokenType.Access,
            });
            yield token_1.AuthorizationUtil.clearAuthorization({
                user,
                tokenType: token_1.AuthTokenType.Refresh,
            });
            res
                .status(200)
                .json({ status: "success", message: "Logout successful", data: null });
        });
    }
    /**
     * Refresh token
     *
     * @description Generates a new access token for the user
     *
     * @param req.body.refreshToken - the user's refresh token
     */
    static refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            const user = yield user_model_1.UserModel.findById(req.authPayload.user._id);
            if (!user) {
                throw new error_1.InternalServerError("User record not found for authenticated request");
            }
            yield token_1.AuthorizationUtil.verifyToken({
                user,
                token: refreshToken,
                tokenType: token_1.AuthTokenType.Refresh,
            });
            const accessToken = yield token_1.AuthorizationUtil.generateToken({
                user,
                tokenType: token_1.AuthTokenType.Access,
                expiry: 3 * 60 * 60,
            });
            res
                .status(200)
                .json({
                status: "success",
                message: "Token refreshed successfully",
                data: { accessToken },
            });
        });
    }
    /**
     * Forgot password flow
     *
     * @description Forgot password flow should require some form of verification,
     * i.e OTP code sent to email or phone number
     * but for the scope of this project, we will just assume that the user has access to the email
     *
     * @param req.body.email - the user's email
     * @param req.body.newPassword - the user's new password
     */
    static forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, newPassword } = req.body;
            const { user } = yield AuthValidator.validateForgotPassword({
                email,
                password: newPassword,
            });
            const userPassword = yield password_model_1.default.findOne({ user: user._id });
            if (!userPassword) {
                throw new error_1.InternalServerError("User password record not found");
            }
            yield userPassword.updatePassword(newPassword);
            res
                .status(200)
                .json({
                status: "success",
                message: "Password reset successful",
                data: null,
            });
        });
    }
    static getLoggedInUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findById(req.authPayload.user._id);
            if (!user) {
                throw new error_1.InternalServerError("User record not found for authenticated request");
            }
            res.status(200).json({
                status: "success",
                message: "User retrieved successfully",
                data: { user },
            });
        });
    }
    static resetPassword() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = AuthController;
