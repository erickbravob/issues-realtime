const { redis } = require('./redis.client');

const publicarEvento = async (canal, tipo, payload) => {

    const evento = {
        tipo,
        payload,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };

    await redis.publish(
        canal,
        JSON.stringify(evento)
    );

};

module.exports = {
    publicarEvento
};