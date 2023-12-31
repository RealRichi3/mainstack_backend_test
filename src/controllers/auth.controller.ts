import { NextFunction, Request, Response } from "express";
import { UserModel, UserRole } from "../models/user.model";
import { BadRequestError, InternalServerError } from "../utils/error";
import mongoose from "mongoose";
import PasswordModel from "../models/password.model";
import { IUserDoc } from "../interfaces/database-models/user";
import { AuthTokenType, AuthorizationUtil } from "../utils/token";
import { AuthenticatedRequest } from "../interfaces/auth";
import Validator from "../utils/validator";
import { ObjectId } from "mongodb";

// Some of the vaidation logic will be moved to the zod validation schema
class AuthValidator {
    static async validateSignup({
        email,
        role,
    }: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        role: UserRole;
    }): Promise<string | null> {
        if (!Object.values(UserRole).includes(role)) {
            throw new BadRequestError("Invalid user role");
        }

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestError("Email is already registered");
        }

        return null; // No validation errors
    }

    static async validateLogin({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<{ user: IUserDoc }> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new BadRequestError("Incorrect email or password");
        }

        if (!user.accountStatus.activated) {
            throw new BadRequestError("Your account has not been activated");
        }

        const userPassword = await PasswordModel.findOne({ user: user._id });
        if (!userPassword) {
            throw new BadRequestError("Invalid email or password");
        }

        const passwordMatch = await userPassword.comparePassword(password);
        if (!passwordMatch) {
            throw new BadRequestError("Incorrect email or password");
        }

        return { user }; // No validation errors
    }

    static async validateForgotPassword({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<{ user: IUserDoc }> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new BadRequestError("Incorrect email");
        }

        const validPassword = Validator.isPassword(password);
        if (!validPassword) {
            throw new BadRequestError("Invalid password");
        }

        return { user }; // No validation errors
    }
}

export default class AuthController {

    /**
     * Login
     *
     * @param req.body.email - the user's email
     * @param req.body.password - the user's password
     */
    static async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const { user } = await AuthValidator.validateLogin({ email, password });

        // All generated tokens are stored in cache
        // The cache is used to verify the tokens
        // Only one active token is allowed per user i.e. if a new token of the same type is generated, the old token is invalidated
        const accessToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Access,
            expiry: 3 * 60 * 60,
        });
        const refreshToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Refresh,
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
    static async signup(req: Request, res: Response) {
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
        await AuthValidator.validateSignup({
            firstname,
            lastname,
            email,
            password,
            role,
        });

        const session = await mongoose.connection.startSession();
        session.startTransaction();

        // Create a new user
        const newUser = await UserModel.create(
            [
                {
                    _id: new ObjectId(),
                    firstname,
                    lastname,
                    email,
                    role,
                    accountStatus: { emailVerified: false, activated: true }, // All accounts will be activated by default for now
                },
            ],
            { session }
        );

        // Create a profile for user
        // Each user has a profile,
        // The profile depends on the user's role i.e (EndUserProfile, AdminProfile, SuperAdminProfile)
        // This is done to allow for extension of data without having to alter the existing schema
        // This will allow different types of users. i.e CustomerSupportAdmin, Marketer e.t.c
        await newUser[0].createProfile();
        await PasswordModel.create(
            [
                {
                    _id: new ObjectId(),
                    user: newUser[0]._id,
                    password,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        await session.endSession();

        res
            .status(201)
            .json({
                status: "success",
                message: "Signup successful",
                data: { user: newUser[0] },
            });
    }

    /**
     * Logout
     *
     * @description Removes the user's access and refresh tokens from the cache
     *
     * @param req.body.refreshToken - the user's refresh token
     */
    static async logout(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const user = await UserModel.findById(req.authPayload.user._id);
        if (!user) {
            throw new InternalServerError(
                "User record not found for authenticated request"
            );
        }

        await AuthorizationUtil.clearAuthorization({
            user,
            tokenType: AuthTokenType.Access,
        });
        await AuthorizationUtil.clearAuthorization({
            user,
            tokenType: AuthTokenType.Refresh,
        });

        res
            .status(200)
            .json({ status: "success", message: "Logout successful", data: null });
    }

    /**
     * Refresh token
     *
     * @description Generates a new access token for the user
     *
     * @param req.body.refreshToken - the user's refresh token
     */
    static async refreshToken(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const { refreshToken } = req.body;

        const user = await UserModel.findById(req.authPayload.user._id);
        if (!user) {
            throw new InternalServerError(
                "User record not found for authenticated request"
            );
        }

        await AuthorizationUtil.verifyToken({
            user,
            token: refreshToken,
            tokenType: AuthTokenType.Refresh,
        });

        const accessToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Access,
            expiry: 3 * 60 * 60,
        });

        res
            .status(200)
            .json({
                status: "success",
                message: "Token refreshed successfully",
                data: { accessToken },
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
    static async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const { email, newPassword } = req.body;

        const { user } = await AuthValidator.validateForgotPassword({
            email,
            password: newPassword,
        });
        const userPassword = await PasswordModel.findOne({ user: user._id });
        if (!userPassword) {
            throw new InternalServerError("User password record not found");
        }

        await userPassword.updatePassword(newPassword);

        res
            .status(200)
            .json({
                status: "success",
                message: "Password reset successful",
                data: null,
            });
    }

    static async getLoggedInUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const user = await UserModel.findById(req.authPayload.user._id);
        if (!user) {
            throw new InternalServerError(
                "User record not found for authenticated request"
            );
        }

        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: { user },
        });
    }

    static async resetPassword() { }
}
