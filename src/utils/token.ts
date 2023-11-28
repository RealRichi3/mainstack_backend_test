import CacheUtil from "./cache";
import jwt from "jsonwebtoken";
import { IUserDoc, IUserProfile, PlainUser } from "../interfaces/database-models/user";
import { JWT_SECRET } from "../config";
import { AuthenticatedUser, TokenPayload } from "../interfaces/auth";
import { ValueOf } from "../interfaces/helper";

enum AuthTokenType {
    Access = 'access',
    Refresh = 'refresh',
    EmailVerification = 'emailverification',
    PasswordReset = 'passwordreset'
}

enum AuthCodeType {
    EmailVerification = 'emailverification',
    PasswordReset = 'passwordreset'
}

export type AuthType = AuthTokenType | AuthCodeType;

type SaveDataToCache = { tokenType: AuthType; data: Record<string, any> | string; user: PlainUser; expiry?: number };


export class AuthTokenCipher {
    static async encodeToken(payload: Record<string, any>, expiry?: number) {
        return jwt.sign(payload, JWT_SECRET, expiry ? { expiresIn: 1000 } : {});
    }

    static async decodeToken(token: string) {
        return jwt.verify(token, JWT_SECRET);
    }
}


class AuthCache {
    static generateKey({ user, tokenType }: { user: PlainUser; tokenType: AuthType }) {
        return `${user._id}:${tokenType}`;
    }

    static async saveData({ tokenType, data, expiry, user }: SaveDataToCache) {
        const key = this.generateKey({ user, tokenType });
        return CacheUtil.saveToCache({ key, value: data, ttl: expiry });
    }

    static async getData({ tokenType, user }: { tokenType: AuthType; user: PlainUser }) {
        const key = this.generateKey({ user, tokenType });
        return CacheUtil.getFromCache(key);
    }

    static async compareToken({ tokenType, token, user }: { tokenType: AuthType; token: string; user: PlainUser }) {
        return this.compareData({ tokenType, user, dataToCompare: token });
    }

    private static async compareData({ tokenType, user, dataToCompare }: { tokenType: AuthType; user: PlainUser; dataToCompare: string }) {
        const tokenSavedInCache = await this.getData({ tokenType, user });
        return tokenSavedInCache === dataToCompare;
    }
}


class AuthorizationUtil {
    static async generateToken({ tokenType, user, expiry }: { tokenType: AuthType; user: IUserDoc; expiry: number }) {
        const userProfile = await user.getProfile()
        const plainUserObject = user.toObject() as PlainUser;

        const expiryDate = new Date()
        expiryDate.setSeconds(expiryDate.getSeconds() + expiry)
        
        const dataToEmbedInToken: TokenPayload = { user: { ...plainUserObject, profile: userProfile }, tokenType, expiryDate };
        const token = await AuthTokenCipher.encodeToken(dataToEmbedInToken, expiry);
        await AuthCache.saveData({ tokenType, data: token, user: plainUserObject, expiry });
        return token;
    }

    static async generateCode({ codeType, user, expiry }: { codeType: AuthCodeType; user: IUserDoc; expiry: number }) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const userProfile = await user.getProfile();
        const plainUserObject = user.toObject() as PlainUser;

        const expiryDate = new Date()
        expiryDate.setSeconds(expiryDate.getSeconds() + expiry)

        const dataToEmbedInCode: TokenPayload = { user: { ...plainUserObject, profile: userProfile }, tokenType: codeType, expiryDate };
        const token = await AuthTokenCipher.encodeToken(dataToEmbedInCode, expiry);
        await AuthCache.saveData({ tokenType: codeType, data: token, user: plainUserObject, expiry });
        return code;
    }

    static async clearAuthorization({ tokenType, user }: { tokenType: AuthType; user: PlainUser }) {
        const key = AuthCache.generateKey({ user, tokenType });
        return CacheUtil.deleteFromCache(key);
    }

    static async verifyToken({ tokenType, token, user }: { tokenType: AuthType; token: string; user: PlainUser }) {
        return AuthCache.compareToken({ tokenType, token, user });
    }
}

export { AuthorizationUtil, AuthTokenType, AuthCodeType };
