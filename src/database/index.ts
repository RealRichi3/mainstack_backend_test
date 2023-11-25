import logger from "../middlewares/logger";
import connectToMongoDBDatabase from "./mongodb";
import { connectToRedisDatabase } from "./redis";

async function initializeDatabaseConnection(): Promise<void> {
    await connectToMongoDBDatabase()
    await connectToRedisDatabase()

    logger.info('Connection to databases successful')
}

export default initializeDatabaseConnection