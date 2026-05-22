const redis = require('./redis.client');

const publicarEvento = async (tipo, payload) => {

    const evento = {
        tipo,
        payload,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };

    await redis.publish(
        'infra:reportes',
        JSON.stringify(evento)
    );

};

module.exports = {
    publicarEvento
};