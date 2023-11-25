import mongoose from 'mongoose';
import { MONGO_URI_DEV, MONGO_URI_PROD, MONGO_URI_TEST, NODE_ENV } from '../config';
import { NodeEnvironment } from '../interfaces/config';
import logger from '../middlewares/logger';

const connectionString: Record<NodeEnvironment, string> = {
    TEST: MONGO_URI_TEST,
    DEV: MONGO_URI_DEV,
    PROD: MONGO_URI_PROD,
}

async function connectToMongoDBDatabase(): Promise<mongoose.Connection> {
    const databaseConnectionString = connectionString[NODE_ENV]
    await mongoose.connect(databaseConnectionString)

    logger.info('Connection to MongoDB database successful')

    return mongoose.connection
}

export default connectToMongoDBDatabase