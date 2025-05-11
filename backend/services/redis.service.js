import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST, // Redis host
  port: process.env.REDIS_PORT, // Redis port       
  password: process.env.REDIS_PASSWORD, // Redis password
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;