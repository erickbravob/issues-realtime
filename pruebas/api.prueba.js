const request = require('supertest');
const app = require('../src/app');

describe('Pruebas básicas de integración de la API', () => {

    let token = '';

    beforeAll(async () => {

        const emailPrueba = `test${Date.now()}@upds.edu.bo`;
        const passwordPrueba = 'clave123';

        await request(app)
            .post('/auth/register')
            .send({
                nombre: 'Usuario Test',
                email: emailPrueba,
                password: passwordPrueba
            });

        const login = await request(app)
            .post('/auth/login')
            .send({
                email: emailPrueba,
                password: passwordPrueba
            });

        token = login.body.token;

    }, 15000);

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

    }, 15000);

    test('POST /api/reportes sin token debe devolver 401', async () => {

        const res = await request(app)
            .post('/api/reportes')
            .send({
                titulo: 'Reporte sin token',
                descripcion: 'Debe ser rechazado',
                ubicacion: 'Bloque Test',
                categoria: 'Seguridad',
                estado: 'Pendiente',
                usuarioNombre: 'Usuario Test',
                usuarioEmail: `sintoken${Date.now()}@upds.edu.bo`
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.ok).toBe(false);

    });

    test('PATCH /api/reportes/:id/estado debe actualizar el estado del reporte con JWT', async () => {

        const crearReporte = await request(app)
            .post('/api/reportes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                titulo: 'Prueba estado',
                descripcion: 'Reporte para prueba PATCH',
                ubicacion: 'Bloque C',
                categoria: 'Infraestructura',
                estado: 'Pendiente',
                usuarioNombre: 'Usuario Test',
                usuarioEmail: `erick${Date.now()}@upds.edu.bo`
            });

        expect(crearReporte.statusCode).toBe(201);
        expect(crearReporte.body.ok).toBe(true);
        expect(crearReporte.body).toHaveProperty('data');
        expect(crearReporte.body.data).toHaveProperty('id');

        const idReporte = crearReporte.body.data.id;

        const res = await request(app)
            .patch(`/api/reportes/${idReporte}/estado`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                estado: 'Atendido'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        expect(res.body.data.estado).toBe('Atendido');

    }, 15000);

});