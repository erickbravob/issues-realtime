const express = require('express');

const router = express.Router();

const {
    registrarUsuario,
    loginUsuario,
    renovarToken,
    cerrarSesion
} = require('../controllers/auth.controller');

const autenticar = require('../middlewares/autenticar');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Erick Bravo
 *               email:
 *                 type: string
 *                 example: erick@upds.edu.bo
 *               password:
 *                 type: string
 *                 example: clave123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Usuario ya registrado
 */
router.post('/register', registrarUsuario);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: erick@upds.edu.bo
 *               password:
 *                 type: string
 *                 example: clave123
 *     responses:
 *       200:
 *         description: Login correcto
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', loginUsuario);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar token JWT usando refresh token
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: 4ad8bd9c785fab57b5b7a9cba309b9c33282894c263b2fe66ff1b38c91c366952b00d21f47afad904d59a149f98e80a9abe17e60273007bfdabffbcf88f4ab08
 *     responses:
 *       200:
 *         description: Token renovado correctamente
 *       400:
 *         description: Refresh token requerido
 *       401:
 *         description: Refresh token inválido o expirado
 */
router.post('/refresh', renovarToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión y revocar token JWT
 *     tags:
 *       - Autenticación
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: Token inválido, expirado o no enviado
 */
router.post('/logout', autenticar, cerrarSesion);

module.exports = router;