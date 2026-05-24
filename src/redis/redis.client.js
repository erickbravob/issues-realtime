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

const guardarCache = async (clave, datos, expiracion = 60) => {

    try {

        await redis.set(
            clave,
            JSON.stringify(datos),
            'EX',
            expiracion
        );

        console.log(`Cache guardado: ${clave}`);

    } catch (error) {

        console.error('Error guardando cache:', error.message);

    }

};

const obtenerCache = async (clave) => {

    try {

        const datos = await redis.get(clave);

        if (!datos) {

            return null;

        }

        console.log(`Cache encontrado: ${clave}`);

        return JSON.parse(datos);

    } catch (error) {

        console.error('Error obteniendo cache:', error.message);

        return null;

    }

};

const eliminarCache = async (clave) => {

    try {

        await redis.del(clave);

        console.log(`Cache eliminado: ${clave}`);

    } catch (error) {

        console.error('Error eliminando cache:', error.message);

    }

};

const eliminarCachePorPatron = async (patron) => {

    try {

        const claves = await redis.keys(patron);

        if (claves.length === 0) {

            console.log(`No hay claves de cache para eliminar con patrón: ${patron}`);

            return;

        }

        await redis.del(claves);

        console.log(`Cache eliminado por patrón: ${patron}`);

    } catch (error) {

        console.error('Error eliminando cache por patrón:', error.message);

    }

};

validarConexionRedis();

module.exports = {
    redis,
    guardarCache,
    obtenerCache,
    eliminarCache,
    eliminarCachePorPatron
};