import { NodeEnvironment } from "../interfaces/config";

export const NODE_ENV = process.env.NODE_ENV as NodeEnvironment;

export const JWT_SECRET = process.env.JWT_SECRET as string;

// Nodemailer with SMTP configuration
export const EMAIL_HOST: string = process.env.EMAIL_HOST as string,
    EMAIL_PORT: number = parseInt(process.env.EMAIL_PORT as string, 10),
    EMAIL_HOST_ADDRESS: string = process.env.EMAIL_HOST_ADDRESS as string,
    OAUTH_CLIENT_ID: string = process.env.OAUTH_CLIENT_ID as string,
    OAUTH_CLIENT_SECRET: string = process.env.OAUTH_CLIENT_SECRET as string,
    OAUTH_REFRESH_TOKEN: string = process.env.OAUTH_REFRESH_TOKEN as string,
    OAUTH_ACCESS_TOKEN: string = process.env.OAUTH_ACCESS_TOKEN as string;

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') as string[] || [];

// Redis
export const REDIS_URL: string = process.env.REDIS_URL as string;

// MongoDB
export const MONGO_URI_DEV: string = process.env.MONGO_URI_DEV as string,
    MONGO_URI_TEST: string = process.env.MONGO_URI_TEST as string,
    MONGO_URI_PROD: string = process.env.MONGO_URI_PROD as string,
    MONGO_URI_LOG: string = process.env.MONGO_URI_LOG as string;
