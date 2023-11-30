"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = __importDefault(require("./validators"));
const route_validator_1 = __importDefault(require("../middlewares/route-validator"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_1 = require("../middlewares/auth");
const token_1 = require("../utils/token");
const router = (0, express_1.Router)();
router
    .post("/login", (0, route_validator_1.default)(validators_1.default.Auth.login), auth_controller_1.default.login)
    .post("/signup", (0, route_validator_1.default)(validators_1.default.Auth.signup), auth_controller_1.default.signup)
    .post("/reset-password", (0, route_validator_1.default)(validators_1.default.Auth.forgotPassword), auth_controller_1.default.forgotPassword)
    .post("/logout", (0, auth_1.verifyAuth)(token_1.AuthTokenType.Access), (0, auth_1.AuthenticatedController)(auth_controller_1.default.logout))
    .post("/refresh", (0, route_validator_1.default)(validators_1.default.Auth.refreshToken), (0, auth_1.verifyAuth)(token_1.AuthTokenType.Refresh), (0, auth_1.AuthenticatedController)(auth_controller_1.default.refreshToken))
    .get("/user", (0, auth_1.verifyAuth)(token_1.AuthTokenType.Access), (0, auth_1.AuthenticatedController)(auth_controller_1.default.getLoggedInUser));
exports.default = router;
