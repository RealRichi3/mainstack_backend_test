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
exports.AuthenticatedController = exports.verifyAuth = void 0;
const token_1 = require("../utils/token");
const error_1 = require("../utils/error");
const verifyAuth = (requiredAuthType) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer'))) {
            return next(new error_1.UnauthenticatedError('Invalid authorization header'));
        }
        const jwtToken = authHeader.split(' ')[1];
        const payload = yield token_1.AuthTokenCipher.decodeToken(jwtToken);
        const tokenData = payload;
        tokenData.token = jwtToken;
        if (tokenData.tokenType !== requiredAuthType) {
            return next(new error_1.UnauthenticatedError('Invalid authentication'));
        }
        /**
         * In some cases the JWT token expiry date is not set
         * Or the expiry can be set to a later date
         *
         * But each token has a expiry date set in the payload
         * In validations we'll use the expiry date set in the payload
         */
        const tokenExpiry = new Date(tokenData.expiryDate).getTime();
        const currentTime = new Date().getTime();
        if (tokenExpiry < currentTime) {
            return next(new error_1.UnauthenticatedError('Invalid authentication'));
        }
        const validAuthProvided = token_1.AuthorizationUtil.verifyToken({ tokenType: requiredAuthType, user: tokenData.user, token: jwtToken });
        if (!validAuthProvided) {
            return next(new error_1.UnauthenticatedError('Invalid authentication'));
        }
        ;
        req.authPayload = tokenData;
        next();
    });
};
exports.verifyAuth = verifyAuth;
function AuthenticatedController(controller) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        return controller(req, res, next);
    });
}
exports.AuthenticatedController = AuthenticatedController;
