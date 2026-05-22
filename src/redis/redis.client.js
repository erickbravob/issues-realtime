const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
    tls: {}
});

redis.on('connect', () => {

    console.log('Redis conectado correctamente');

});

redis.on('error', (error) => {

    console.error('Error Redis:', error.message);

});

module.exports = redis;