const express = require('express');

const router = express.Router();

const autenticar = require('../middlewares/autenticar');

const {
    listarReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    crearSeguimientoReporte,
    actualizarEstadoReporte
} = require('../controllers/reportes.controller');

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener todos los reportes
 *     tags:
 *       - Reportes
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida correctamente
 */
router.get('/', listarReportes);

/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear un nuevo reporte
 *     tags:
 *       - Reportes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               estado:
 *                 type: string
 *               usuarioNombre:
 *                 type: string
 *               usuarioEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reporte creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post('/', autenticar, crearReporte);

/**
 * @swagger
 * /api/reportes/seguimiento/{id}:
 *   post:
 *     summary: Registrar seguimiento de un reporte
 *     tags:
 *       - Seguimientos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detalle:
 *                 type: string
 *               responsable:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seguimiento creado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reporte no encontrado
 */
router.post('/seguimiento/:id', autenticar, crearSeguimientoReporte);

/**
 * @swagger
 * /api/reportes/{id}/estado:
 *   patch:
 *     summary: Actualizar solo el estado de un reporte
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: Atendido
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reporte no encontrado
 */
router.patch('/:id/estado', autenticar, actualizarEstadoReporte);

/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Obtener un reporte por ID
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *       404:
 *         description: Reporte no encontrado
 */
router.get('/:id', obtenerReportePorId);

/**
 * @swagger
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar un reporte
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reporte actualizado correctamente
 *       404:
 *         description: Reporte no encontrado
 */
router.put('/:id', autenticar, actualizarReporte);

/**
 * @swagger
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar un reporte
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte eliminado correctamente
 *       404:
 *         description: Reporte no encontrado
 */
router.delete('/:id', autenticar, eliminarReporte);

module.exports = router;