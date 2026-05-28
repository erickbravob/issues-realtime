const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        return res.status(401).json({
            ok: false,
            mensaje: 'Acceso denegado. Debe enviar el token en Authorization: Bearer TOKEN'
        });

    }

    const token = authHeader.split(' ')[1];

    try {

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = payload;

        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {

            return res.status(401).json({
                ok: false,
                mensaje: 'Token expirado, inicia sesión nuevamente'
            });

        }

        return res.status(401).json({
            ok: false,
            mensaje: 'Token inválido'
        });

    }

};

module.exports = autenticar;