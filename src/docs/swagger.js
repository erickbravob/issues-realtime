const swaggerJsdoc = require('swagger-jsdoc');

const opcionesSwagger = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST - Reportes de Infraestructura Universitaria',
            version: '1.0.0',
            description: 'Documentación Swagger para la API de reportes universitarios'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            },
            {
                url: 'https://actividad-1-api-reportes.onrender.com',
                description: 'Servidor en producción'
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/server.js']
};

const swaggerSpec = swaggerJsdoc(opcionesSwagger);

module.exports = swaggerSpec;