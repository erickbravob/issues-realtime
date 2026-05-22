require('dotenv').config();

const Redis = require('ioredis');

const subscriber = new Redis(process.env.REDIS_URL, {
    tls: {}
});

const canales = [
    'infra:reportes',
    'infra:notificaciones'
];

subscriber.subscribe(...canales, (error, count) => {

    if (error) {

        console.error('Error al suscribirse:', error.message);

        return;

    }

    console.log(`Suscrito a ${count} canal(es): ${canales.join(', ')}`);

});

subscriber.on('message', (canal, mensaje) => {

    const evento = JSON.parse(mensaje);

    console.log('--------------------------------');
    console.log('Canal:', canal);
    console.log('Tipo:', evento.tipo);
    console.log('Timestamp:', evento.timestamp);
    console.log('Versión:', evento.version);
    console.log('Payload:', evento.payload);
    console.log('--------------------------------');

});