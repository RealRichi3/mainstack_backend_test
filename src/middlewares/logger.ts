import util from "util";
import winston, { format } from "winston";
import winstonMongoDB from 'winston-mongodb'
import { MONGO_URI_LOG } from "../config";
import { NODE_ENV } from "../config";
import { NodeEnvironment } from "../interfaces/config";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf((info) => {
    let message = info.message;

    if (typeof message === 'object') {
        message = util.inspect(message, { depth: null });
    }

    return `${info.timestamp} [${info.level}]: ${message}`;
});

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const transports: Record<NodeEnvironment, winston.transport[]> = {
    'PROD': [
        new winstonMongoDB.MongoDB({
            level: 'error',
            db: MONGO_URI_LOG,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            ),
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: 'error_logs',
            metaKey: 'meta',
            storeHost: true,
            capped: true
        }),
        new winstonMongoDB.MongoDB({
            level: 'info',
            db: MONGO_URI_LOG,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            ),
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: 'info_logs',
            metaKey: 'meta',
            storeHost: true,
            capped: true
        }),
        new winstonMongoDB.MongoDB({
            level: 'warn',
            db: MONGO_URI_LOG,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            ),
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
        new winston.transports.Console({
            level: 'info',
            format: combine(
                enumerateErrorFormat(),
                colorize({
                    colors: { info: 'cyan', error: 'red' }
                }),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                logFormat
            ),
        })
    ],
    'TEST': [
        new winston.transports.Console({
            level: 'info',
            format: combine(
                enumerateErrorFormat(),
                colorize({
                    colors: { info: 'cyan', error: 'red' }
                }),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                logFormat
            ),
        })
    ]
}

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        enumerateErrorFormat(),
        colorize({
            colors: { info: 'cyan', error: 'red' }
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: transports[NODE_ENV]
});

export default logger;
