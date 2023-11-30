"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../utils/error");
const logger_1 = __importDefault(require("./logger"));
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
function errorHandler(err, req, res, next) {
    // console.error(err)
    logger_1.default.error(err.stack);
    if (err instanceof error_1.CustomAPIError && err.statusCode !== 500) {
        return res.status(err.statusCode).send({
            status: 'error',
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).send({
            status: 'error',
            errors: err.errors,
            message: 'Validation Error',
        });
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({
                status: 'error',
                message: 'Token Expired',
            });
        }
        else if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({
                status: 'error',
                message: 'Invalid Token',
            });
        }
    }
    // if the error is not one of the specific types above, return a generic internal server error
    return res.status(500).send({ status: 'error', message: 'Ops, Something went wrong' });
}
exports.default = errorHandler;
