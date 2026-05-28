const rateLimit = require('express-rate-limit');

const limitadorGeneral = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        mensaje: 'Demasiadas peticiones desde esta IP. Intente nuevamente en 15 minutos.'
    }
});

module.exports = limitadorGeneral;