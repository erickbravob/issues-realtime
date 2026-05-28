const express = require('express');

const router = express.Router();

const {
    registrarUsuario,
    loginUsuario
} = require('../controllers/auth.controller');

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

module.exports = router;