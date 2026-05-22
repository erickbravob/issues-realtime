require('dotenv').config();

const Redis = require('ioredis');

const subscriber = new Redis(process.env.REDIS_URL, {
    tls: {}
});

subscriber.psubscribe('infra:*', (error, count) => {

    if (error) {

        console.error('Error al suscribirse:', error.message);

        return;

    }

    console.log(`Suscrito a ${count} patrón(es)`);

});

subscriber.on('pmessage', (patron, canal, mensaje) => {

    const evento = JSON.parse(mensaje);

    console.log('--------------------------------');
    console.log('Patrón:', patron);
    console.log('Canal:', canal);
    console.log('Tipo:', evento.tipo);
    console.log('Timestamp:', evento.timestamp);
    console.log('Versión:', evento.version);

    switch (evento.tipo) {

        case 'infra:reporte:creado':

            console.log('Nuevo reporte registrado');
            break;

        case 'infra:reporte:actualizado':

            console.log('Reporte actualizado');
            break;

        case 'infra:reporte:eliminado':

            console.log('Reporte eliminado');
            break;

        default:

            console.log('Evento no identificado');

    }

    console.log('Payload:', evento.payload);
    console.log('--------------------------------');

});