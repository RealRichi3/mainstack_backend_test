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
const error_1 = require("../utils/error");
const auth_1 = require("./auth");
function checkUsersPriviledges(req) {
    // Implement logic to check if the user has the required priviledge to access the route
    return true;
}
const criticalRoutes = {
    '/user/delete': true,
};
// Role-based access control middleware
function rbacHandler(roles) {
    return (0, auth_1.AuthenticatedController)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const { user } = req.authPayload;
        /**
         * Check if the user has the required role to access the route
         *
         * Some users may have the required role but may have been restricted from accessing
         * the route. So we will check if the user has the required priviledge to access the route
         */
        let isPermitted = roles.includes(user.role);
        /**
         * If the route is critical, we will not check the priviledge of the user
         * and just return the result of the role check.
         *
         * Critical routes are routes that are strictly for specified admin use only.
         * So in this case, we will not check if the user has the required priviledge
         */
        const routeIsCritical = criticalRoutes[req.path];
        const response = routeIsCritical ? isPermitted : checkUsersPriviledges(req) && isPermitted;
        isPermitted = response === true;
        if (!isPermitted) {
            return next(new error_1.ForbiddenError('You are not authorized to perform this action.'));
        }
        next();
    }));
}
exports.default = rbacHandler;
