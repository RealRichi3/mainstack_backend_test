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
exports.AuthCodeType = exports.AuthTokenType = exports.AuthorizationUtil = exports.AuthTokenCipher = void 0;
const cache_1 = __importDefault(require("./cache"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
var AuthTokenType;
(function (AuthTokenType) {
    AuthTokenType["Access"] = "access";
    AuthTokenType["Refresh"] = "refresh";
    AuthTokenType["EmailVerification"] = "emailverification";
    AuthTokenType["PasswordReset"] = "passwordreset";
})(AuthTokenType || (exports.AuthTokenType = AuthTokenType = {}));
var AuthCodeType;
(function (AuthCodeType) {
    AuthCodeType["EmailVerification"] = "emailverification";
    AuthCodeType["PasswordReset"] = "passwordreset";
})(AuthCodeType || (exports.AuthCodeType = AuthCodeType = {}));
class AuthTokenCipher {
    static encodeToken(payload, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET, expiry ? { expiresIn: 1000 } : {});
        });
    }
    static decodeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        });
    }
}
exports.AuthTokenCipher = AuthTokenCipher;
class AuthCache {
    static generateKey({ user, tokenType, }) {
        return `${user._id}:${tokenType}`;
    }
    static saveData({ tokenType, data, expiry, user }) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.generateKey({ user, tokenType });
            return cache_1.default.saveToCache({ key, value: data, ttl: expiry });
        });
    }
    static getData({ tokenType, user, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.generateKey({ user, tokenType });
            return cache_1.default.getFromCache(key);
        });
    }
    static compareToken({ tokenType, token, user, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.compareData({ tokenType, user, dataToCompare: token });
        });
    }
    static compareData({ tokenType, user, dataToCompare, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenSavedInCache = yield this.getData({ tokenType, user });
            return tokenSavedInCache === dataToCompare;
        });
    }
}
class AuthorizationUtil {
    static generateToken({ tokenType, user, expiry, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield user.getProfile();
            const plainUserObject = user.toObject();
            const expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + expiry);
            const dataToEmbedInToken = {
                user: Object.assign(Object.assign({}, plainUserObject), { profile: userProfile }),
                tokenType,
                expiryDate,
            };
            const token = yield AuthTokenCipher.encodeToken(dataToEmbedInToken, expiry);
            yield AuthCache.saveData({
                tokenType,
                data: token,
                user: plainUserObject,
                expiry,
            });
            return token;
        });
    }
    static generateCode({ codeType, user, expiry, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const userProfile = yield user.getProfile();
            const plainUserObject = user.toObject();
            const expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + expiry);
            const dataToEmbedInCode = {
                user: Object.assign(Object.assign({}, plainUserObject), { profile: userProfile }),
                tokenType: codeType,
                expiryDate,
            };
            const token = yield AuthTokenCipher.encodeToken(dataToEmbedInCode, expiry);
            yield AuthCache.saveData({
                tokenType: codeType,
                data: token,
                user: plainUserObject,
                expiry,
            });
            return code;
        });
    }
    static clearAuthorization({ tokenType, user, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = AuthCache.generateKey({ user, tokenType });
            return cache_1.default.deleteFromCache(key);
        });
    }
    static verifyToken({ tokenType, token, user, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return AuthCache.compareToken({ tokenType, token, user });
        });
    }
}
exports.AuthorizationUtil = AuthorizationUtil;
