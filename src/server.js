require('dotenv').config();
require('./redis/redis.client');

const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const reportesRoutes = require('./routes/reportes.routes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {

    res.json({
        ok: true,
        mensaje: 'API de reportes funcionando'
    });

});

app.use('/api/reportes', reportesRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar estado de la API
 *     tags:
 *       - Sistema
 *     responses:
 *       200:
 *         description: API activa
 */
app.get('/api/health', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'API activa'
    });

});

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: Obtener información general de la API
 *     tags:
 *       - Sistema
 *     responses:
 *       200:
 *         description: Información de la API
 */
app.get('/api/info', (req, res) => {

    res.status(200).json({
        nombre: 'API REST - Reportes Universitarios',
        version: '1.0.0',
        autor: 'Erick Bravo',
        materia: 'Programación IV',
        universidad: 'Universidad Privada Domingo Savio'
    });

});

app.use((req, res) => {

    res.status(404).json({
        ok: false,
        mensaje: 'Ruta no encontrada'
    });

});

app.use((err, req, res, next) => {

    res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor'
    });

});

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en puerto ${PORT}`);

});