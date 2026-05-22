require('dotenv').config();

const Redis = require('ioredis');

const subscriber = new Redis(process.env.REDIS_URL, {
    tls: {}
});

subscriber.subscribe('infra:reportes', (error, count) => {

    if (error) {

        console.error('Error al suscribirse:', error.message);

        return;

    }

    console.log(`Suscrito a ${count} canal(es)`);

});

subscriber.on('message', (canal, mensaje) => {

    console.log('--------------------------------');
    console.log('Canal:', canal);
    console.log('Mensaje recibido:');
    console.log(mensaje);
    console.log('--------------------------------');

});