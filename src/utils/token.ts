import CacheUtil from "./cache";
import jwt from "jsonwebtoken";
import { IUserDoc } from "../interfaces/database-models/user";
import { JWT_SECRET } from "../config";

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

type AuthType = AuthTokenType | AuthCodeType;

type AuthTokenData = { user: IUserDoc; tokenType: AuthType; expiryDate: Date };
type SaveDataToCache = { tokenType: AuthType; data: Record<string, any> | string; user: IUserDoc; expiry?: number };


class AuthTokenCipher {
    static async encodeToken(payload: string, expiry?: number) {
        return jwt.sign(payload, JWT_SECRET, expiry ? { expiresIn: expiry } : {});
    }

    static async decodeToken(token: string) {
        return jwt.verify(token, JWT_SECRET);
    }
}


class AuthCache {
    static generateKey({ user, tokenType }: { user: IUserDoc; tokenType: AuthType }) {
        return `${user._id}:${tokenType}`;
    }

    static async saveData({ tokenType, data, expiry, user }: SaveDataToCache) {
        const key = this.generateKey({ user, tokenType });
        return CacheUtil.saveToCache({ key, value: data, ttl: expiry });
    }

    static async getData({ tokenType, user }: { tokenType: AuthType; user: IUserDoc }) {
        const key = this.generateKey({ user, tokenType });
        return CacheUtil.getFromCache(key);
    }

    static async compareToken({ tokenType, token, user }: { tokenType: AuthType; token: string; user: IUserDoc }) {
        return this.compareData({ tokenType, user, dataToCompare: token });
    }

    private static async compareData({ tokenType, user, dataToCompare }: { tokenType: AuthType; user: IUserDoc; dataToCompare: string }) {
        const tokenSavedInCache = await this.getData({ tokenType, user });
        return tokenSavedInCache === dataToCompare;
    }
}


class AuthorizationUtil {
    static async generateToken({ tokenType, user, expiry }: { tokenType: AuthType; user: IUserDoc; expiry: number }) {
        const token = await AuthTokenCipher.encodeToken(user._id, expiry);
        const dataToEmbedInToken: AuthTokenData = { user, tokenType, expiryDate: new Date(expiry) };
        await AuthCache.saveData({ tokenType, data: dataToEmbedInToken, user, expiry });
        return token;
    }

    static async generateCode({ codeType, user, expiry }: { codeType: AuthCodeType; user: IUserDoc; expiry: number }) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const dataToEmbedInCode: AuthTokenData = { user, tokenType: codeType, expiryDate: new Date(expiry) };
        await AuthCache.saveData({ tokenType: codeType, data: dataToEmbedInCode, user, expiry });
        return code;
    }

    static async clearAuthorization({ tokenType, user }: { tokenType: AuthType; user: IUserDoc }) {
        const key = AuthCache.generateKey({ user, tokenType });
        return CacheUtil.deleteFromCache(key);
    }

    static async compareToken({ tokenType, token, user }: { tokenType: AuthType; token: string; user: IUserDoc }) {
        return AuthCache.compareToken({ tokenType, token, user });
    }
}

export { AuthorizationUtil, AuthTokenType, AuthCodeType };
