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
exports.requestResponseLogger = void 0;
const logger_1 = __importDefault(require("./logger"));
const crypto_1 = require("crypto");
const requestResponseLogger = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requestId = (0, crypto_1.randomUUID)(); // Generate a unique request ID
    res.locals.request_ref_id = requestId; // Set the request ID on the response object to be used in the response logger
    const requestDetails = {
        resource: req.method + " " + req.originalUrl,
        user: (_a = req.authPayload) === null || _a === void 0 ? void 0 : _a.user.email,
        // query: req.query,
        body: req.body,
        timestamp: new Date().toISOString(),
        request_ref_id: requestId,
    };
    logger_1.default.info('Request', { meta: requestDetails });
    const originalSend = res.send.bind(res);
    res.send = function (data) {
        res.locals.data = data;
        originalSend(data);
    };
    res.on("finish", () => {
        var _a;
        const responseDetails = {
            status: res.statusCode,
            user: (_a = req.authPayload) === null || _a === void 0 ? void 0 : _a.user.email,
            message: res.statusMessage,
            timestamp: new Date().toISOString(),
            data: JSON.parse(res.locals.data),
            request_ref_id: requestDetails.request_ref_id,
        };
        logger_1.default.info('Response', { meta: responseDetails });
    });
    next();
});
exports.requestResponseLogger = requestResponseLogger;
exports.default = exports.requestResponseLogger;
