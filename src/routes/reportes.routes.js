const express = require('express');

const router = express.Router();

const {
    listarReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte
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
 *     responses:
 *       201:
 *         description: Reporte creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post('/', crearReporte);

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
router.put('/:id', actualizarReporte);

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
router.delete('/:id', eliminarReporte);

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

module.exports = router;