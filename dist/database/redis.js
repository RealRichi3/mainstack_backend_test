"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToRedisDatabase = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../middlewares/logger"));
const redisClient = new ioredis_1.default(config_1.REDIS_URL);
function connectToRedisDatabase() {
    return redisClient;
}
exports.connectToRedisDatabase = connectToRedisDatabase;
redisClient.on('error', (error) => {
    logger_1.default.info('An error occured while connecting to REDIS');
    logger_1.default.error(error);
    process.exit(1);
});
redisClient.on('connect', () => {
    logger_1.default.info('Connection to REDIS database successful');
});
exports.default = redisClient;
