import Redis from 'ioredis'
import { REDIS_URL } from '../config'
import logger from '../middlewares/logger'

const redisClient = new Redis(REDIS_URL)

async function connectToRedisDatabase(): Promise<Redis> {
    await redisClient.connect()

    return redisClient
}

redisClient.on('error', (error) => {
    logger.info('An error occured while connecting to REDIS')
    logger.error(error)

    process.exit(1)
})

redisClient.on('connect', () => {
    logger.info('Connection to REDIS database successful')
})

export { connectToRedisDatabase }
export default redisClient