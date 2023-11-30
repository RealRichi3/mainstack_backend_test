"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const winston_1 = __importStar(require("winston"));
const winston_mongodb_1 = __importDefault(require("winston-mongodb"));
const config_1 = require("../config");
const config_2 = require("../config");
const { combine, timestamp, printf, colorize } = winston_1.format;
const logFormat = printf((info) => {
    let message = info.message;
    if (typeof message === 'object') {
        message = util_1.default.inspect(message, { depth: null });
    }
    return `${info.timestamp} [${info.level}]: ${message}`;
});
const enumerateErrorFormat = (0, winston_1.format)((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
const transports = {
    'PROD': [
        new winston_mongodb_1.default.MongoDB({
            level: 'error',
            db: config_1.MONGO_URI_LOG,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.simple()),
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: 'error_logs',
            metaKey: 'meta',
            storeHost: true,
            capped: true
        }),
        new winston_mongodb_1.default.MongoDB({
            level: 'info',
            db: config_1.MONGO_URI_LOG,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.simple()),
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: 'info_logs',
            metaKey: 'meta',
            storeHost: true,
            capped: true
        }),
        new winston_mongodb_1.default.MongoDB({
            level: 'warn',
            db: config_1.MONGO_URI_LOG,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.simple()),
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: 'warn_logs',
            metaKey: 'meta',
            storeHost: true,
            capped: true
        })
    ],
    'DEV': [
        new winston_1.default.transports.Console({
            level: 'info',
            format: combine(enumerateErrorFormat(), colorize({
                colors: { info: 'cyan', error: 'red' }
            }), timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }), logFormat),
        })
    ],
    'TEST': [
        new winston_1.default.transports.Console({
            level: 'info',
            format: combine(enumerateErrorFormat(), colorize({
                colors: { info: 'cyan', error: 'red' }
            }), timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }), logFormat),
        })
    ]
};
const logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(enumerateErrorFormat(), colorize({
        colors: { info: 'cyan', error: 'red' }
    }), timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), logFormat),
    transports: transports[config_2.NODE_ENV],
});
exports.default = logger;
