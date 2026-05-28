const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma = require('../config/prisma.client');
const {
    agregarTokenBlacklist
} = require('../redis/redis.client');

const generarAccessToken = (usuario) => {

    return jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    );

};

const generarRefreshToken = () => {

    return crypto.randomBytes(64).toString('hex');

};

const calcularExpiracionRefresh = () => {

    const fecha = new Date();

    fecha.setDate(fecha.getDate() + 7);

    return fecha;

};

const registrarUsuario = async (req, res) => {

    try {

        const {
            nombre,
            email,
            password
        } = req.body;

        if (!nombre || !email || !password) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Nombre, email y password son obligatorios'
            });

        }

        if (password.length < 6) {

            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña debe tener mínimo 6 caracteres'
            });

        }

        const emailNormalizado = email.toLowerCase().trim();

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado
            }
        });

        if (usuarioExiste && usuarioExiste.password) {

            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe una cuenta registrada con ese email'
            });

        }

        const passwordHash = await bcrypt.hash(password, 12);

        let usuario;

        if (usuarioExiste && !usuarioExiste.password) {

            usuario = await prisma.usuario.update({
                where: {
                    id: usuarioExiste.id
                },
                data: {
                    nombre,
                    password: passwordHash
                }
            });

        } else {

            usuario = await prisma.usuario.create({
                data: {
                    nombre,
                    email: emailNormalizado,
                    password: passwordHash
                }
            });

        }

        res.status(201).json({
            ok: true,
            mensaje: 'Usuario registrado correctamente',
            data: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                createdAt: usuario.createdAt
            }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error interno al registrar usuario'
        });

    }

};

const loginUsuario = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Email y password son obligatorios'
            });

        }

        const emailNormalizado = email.toLowerCase().trim();

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado
            }
        });

        if (!usuario || !usuario.password) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Credenciales incorrectas'
            });

        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Credenciales incorrectas'
            });

        }

        const accessToken = generarAccessToken(usuario);
        const refreshToken = generarRefreshToken();

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                usuarioId: usuario.id,
                expiresAt: calcularExpiracionRefresh()
            }
        });

        res.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            token: accessToken,
            refreshToken,
            tipo: 'Bearer',
            expiraEn: process.env.JWT_EXPIRES_IN || '1h',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error interno al iniciar sesión'
        });

    }

};

const renovarToken = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Refresh token requerido'
            });

        }

        const tokenGuardado = await prisma.refreshToken.findUnique({
            where: {
                token: refreshToken
            },
            include: {
                usuario: true
            }
        });

        if (!tokenGuardado) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Refresh token inválido'
            });

        }

        if (tokenGuardado.expiresAt < new Date()) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Refresh token expirado'
            });

        }

        const nuevoAccessToken = generarAccessToken(tokenGuardado.usuario);

        res.status(200).json({
            ok: true,
            mensaje: 'Token renovado correctamente',
            token: nuevoAccessToken,
            tipo: 'Bearer',
            expiraEn: process.env.JWT_EXPIRES_IN || '1h'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error interno al renovar token'
        });

    }

};

const cerrarSesion = async (req, res) => {

    try {

        const token = req.token;

        const decoded = jwt.decode(token);

        if (!decoded || !decoded.exp) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Token inválido para cerrar sesión'
            });

        }

        const segundosRestantes = decoded.exp - Math.floor(Date.now() / 1000);

        if (segundosRestantes > 0) {

            await agregarTokenBlacklist(token, segundosRestantes);

        }

        res.status(200).json({
            ok: true,
            mensaje: 'Sesión cerrada correctamente. Token revocado en Redis'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            mensaje: 'Error interno al cerrar sesión'
        });

    }

};

module.exports = {
    registrarUsuario,
    loginUsuario,
    renovarToken,
    cerrarSesion
};