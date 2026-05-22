const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
    tls: {},
    retryStrategy: (times) => {

        const delay = Math.min(times * 100, 3000);

        console.log(`Reintentando conexión Redis en ${delay} ms`);

        return delay;

    }
});

redis.on('connect', () => {

    console.log('Redis conectado correctamente');

});

redis.on('ready', () => {

    console.log('Redis listo para recibir comandos');

});

redis.on('error', (error) => {

    console.error('Error Redis:', error.message);

});

const validarConexionRedis = async () => {

    try {

        const respuesta = await redis.ping();

        console.log(`Validación Redis exitosa: ${respuesta}`);

    } catch (error) {

        console.error('No se pudo validar la conexión Redis:', error.message);

    }

};

validarConexionRedis();

module.exports = redis;