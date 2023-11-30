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
exports.collectionOptions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../middlewares/logger"));
exports.collectionOptions = {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        getters: true,
    },
    toObject: {
        virtuals: true,
        getters: true,
    },
};
const connectionString = {
    TEST: config_1.MONGO_URI_TEST,
    DEV: config_1.MONGO_URI_DEV,
    PROD: config_1.MONGO_URI_PROD,
};
function connectToMongoDBDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const databaseConnectionString = connectionString[config_1.NODE_ENV];
        yield mongoose_1.default.connect(databaseConnectionString);
        logger_1.default.info('Connection to MongoDB database successful');
        return mongoose_1.default.connection;
    });
}
exports.default = connectToMongoDBDatabase;
