const request = require('supertest');
const app = require('../src/app');

describe('Pruebas básicas de integración de la API', () => {

    test('GET /api/health debe responder API activa', async () => {

        const res = await request(app).get('/api/health');

        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.mensaje).toBe('API activa');

    });

    test('GET /api/info debe devolver información del sistema', async () => {

        const res = await request(app).get('/api/info');

        expect(res.statusCode).toBe(200);
        expect(res.body.nombre).toBe('API REST - Reportes Universitarios');
        expect(res.body.materia).toBe('Programación IV');

    });

    test('GET /api/reportes debe listar reportes desde la API', async () => {

        const res = await request(app).get('/api/reportes');

        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body).toHaveProperty('data');

    });

});