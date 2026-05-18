const express = require('express');

const router = express.Router();

const {
    listarReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte
} = require('../controllers/reportes.controller');

router.get('/', listarReportes);

router.get('/:id', obtenerReportePorId);

router.post('/', crearReporte);

router.put('/:id', actualizarReporte);

router.delete('/:id', eliminarReporte);

module.exports = router;