import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth';
import { ForbiddenError } from '../utils/error';
import { AuthenticatedController } from './auth';

async function checkUsersPriviledges(req: AuthenticatedRequest) {
    // Implement logic to check if the user has the required priviledge to access the route
}

const criticalRoutes = {
    '/user/delete': true,
} as Record<string, true>

// Role-based access control middleware
export default function rbacHandler(roles: string[]) {
    return AuthenticatedController(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction)
            : Promise<void> => {
            const { user } = req.authPayload;

            /**
             * Check if the user has the required role to access the route
             * 
             * Some users may have the required role but may have been restricted from accessing
             * the route. So we will check if the user has the required priviledge to access the route
             */
            let isPermitted = roles.includes(user.role)

            /**
             * If the route is critical, we will not check the priviledge of the user
             * and just return the result of the role check.
             * 
             * Critical routes are routes that are strictly for specified admin use only.
             * So in this case, we will not check if the user has the required priviledge
             */
            const routeIsCritical = criticalRoutes[req.path]
            const response = routeIsCritical ? isPermitted : await checkUsersPriviledges(req)

            isPermitted = response === true

            if (!isPermitted) {
                return next(new ForbiddenError('You are not authorized to perform this action.'))
            }

            next()
        })
}