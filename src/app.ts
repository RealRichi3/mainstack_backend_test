import 'express-async-errors'
import express, { Application, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import { ALLOWED_ORIGINS, NODE_ENV } from './config'
import routeHandler from './routes'

const app: Application = express();

function initializeMiddlewares(app: Application): void {
    NODE_ENV === 'DEV' && app.use(morgan('dev'))

    app.use(helmet())

    app.use(cors({
        origin: ALLOWED_ORIGINS,
        credentials: true
    }))

    app.use(express.json())
}

function initializeRouteHandlers(app: Application): void {
    app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
        res.status(200).send({
            status: 'success',
            message: 'Welcome to the API'
        })
    })

    app.use('/api/v1', routeHandler)

    app.all('*', (_req: Request, res: Response, _next: NextFunction) => {
        res.status(404).send({
            status: 'error',
            message: 'Route not found'
        })
    })

    return
}

function initializeExpressServer(): Application {
    initializeMiddlewares(app)
    initializeRouteHandlers(app)

    return app
}

export {
    initializeExpressServer
}

export default app