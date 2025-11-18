import Redis from 'redis';
import { config } from './config';
import { logger } from '../utils/logger';

const redis = Redis.createClient({
    url: config.redisUrl,
});

redis.on('error', (err) => {
    logger.error('Redis Client Error:', err);
});

redis.on('connect', () => {
    logger.info('Redis connected successfully');
});

redis.connect();

export { redis };