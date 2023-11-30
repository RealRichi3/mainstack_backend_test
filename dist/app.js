"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeExpressServer = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = __importDefault(require("./middlewares/error-handler"));
const app = (0, express_1.default)();
function initializeMiddlewares(app) {
    config_1.NODE_ENV === "DEV" && app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: config_1.ALLOWED_ORIGINS,
        credentials: true,
    }));
    app.use(express_1.default.json());
}
function initializeRouteHandlers(app) {
    app.get("/", (_req, res, _next) => {
        res.status(200).send({
            status: "success",
            message: "Welcome to the API",
        });
    });
    app.use("/api/v1", routes_1.default);
    app.all("*", (_req, res, _next) => {
        res.status(404).send({
            status: "error",
            message: "Route not found",
        });
    });
    app.use(error_handler_1.default);
    return;
}
function initializeExpressServer() {
    initializeMiddlewares(app);
    initializeRouteHandlers(app);
    return app;
}
exports.initializeExpressServer = initializeExpressServer;
exports.default = app;
