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
const redis_1 = __importDefault(require("../database/redis"));
class CacheUtil {
    static saveToCache({ key, value, ttl }) {
        return __awaiter(this, void 0, void 0, function* () {
            ttl
                ? yield redis_1.default.setex(key, ttl, JSON.stringify(value))
                : yield redis_1.default.set(key, JSON.stringify(value));
        });
    }
    static getFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield redis_1.default.get(key);
        });
    }
    static deleteFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.default.del(key);
        });
    }
}
exports.default = CacheUtil;
