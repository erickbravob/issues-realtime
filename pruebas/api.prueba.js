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

    test('PATCH /api/reportes/:id/estado debe actualizar el estado del reporte', async () => {

        const crearReporte = await request(app)
            .post('/api/reportes')
            .send({
                titulo: 'Prueba estado',
                descripcion: 'Reporte para prueba PATCH',
                ubicacion: 'Bloque C',
                categoria: 'Infraestructura',
                estado: 'Pendiente',
                usuarioNombre: 'Erick Bravo',
                usuarioEmail: `erick${Date.now()}@upds.edu.bo`
            });

        expect(crearReporte.statusCode).toBe(201);
        expect(crearReporte.body.ok).toBe(true);
        expect(crearReporte.body).toHaveProperty('data');
        expect(crearReporte.body.data).toHaveProperty('id');

        const idReporte = crearReporte.body.data.id;

        const res = await request(app)
            .patch(`/api/reportes/${idReporte}/estado`)
            .send({
                estado: 'Atendido'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data.estado).toBe('Atendido');

    }, 15000);

});