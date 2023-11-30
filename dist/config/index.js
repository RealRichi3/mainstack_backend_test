"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URI_LOG = exports.MONGO_URI_PROD = exports.MONGO_URI_TEST = exports.MONGO_URI_DEV = exports.REDIS_URL = exports.ALLOWED_ORIGINS = exports.OAUTH_ACCESS_TOKEN = exports.OAUTH_REFRESH_TOKEN = exports.OAUTH_CLIENT_SECRET = exports.OAUTH_CLIENT_ID = exports.EMAIL_HOST_ADDRESS = exports.EMAIL_PORT = exports.EMAIL_HOST = exports.JWT_SECRET = exports.NODE_ENV = void 0;
exports.NODE_ENV = process.env.NODE_ENV;
exports.JWT_SECRET = process.env.JWT_SECRET;
// Nodemailer with SMTP configuration
exports.EMAIL_HOST = process.env.EMAIL_HOST, exports.EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10), exports.EMAIL_HOST_ADDRESS = process.env.EMAIL_HOST_ADDRESS, exports.OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID, exports.OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET, exports.OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN, exports.OAUTH_ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN;
exports.ALLOWED_ORIGINS = ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
// Redis
exports.REDIS_URL = process.env.REDIS_URL;
// MongoDB
exports.MONGO_URI_DEV = process.env.MONGO_URI_DEV, exports.MONGO_URI_TEST = process.env.MONGO_URI_TEST, exports.MONGO_URI_PROD = process.env.MONGO_URI_PROD, exports.MONGO_URI_LOG = process.env.MONGO_URI_LOG;
