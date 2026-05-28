const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const reportesRoutes = require('./routes/reportes.routes');

const authRoutes = require('./routes/auth.routes');

const helmet = require('helmet');
const limitadorGeneral = require('./middlewares/rateLimit');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limitadorGeneral);
app.use(express.static('public'));

app.get('/', (req, res) => {

    res.json({
        ok: true,
        mensaje: 'API de reportes funcionando'
    });

});

app.use('/api/reportes', reportesRoutes);

app.use('/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'API activa'
    });

});

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

module.exports = app;