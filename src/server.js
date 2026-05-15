require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

let reportes = [
    {
        id: 1,
        titulo: 'Luminaria quemada',
        descripcion: 'La luminaria del pasillo del bloque B no funciona.',
        ubicacion: 'Bloque B - Segundo piso',
        categoria: 'Iluminación',
        estado: 'Pendiente'
    },
    {
        id: 2,
        titulo: 'Baño dañado',
        descripcion: 'El lavamanos del baño de estudiantes tiene fuga de agua.',
        ubicacion: 'Bloque A - Planta baja',
        categoria: 'Servicios básicos',
        estado: 'Pendiente'
    }
];

app.get('/', (req, res) => {

    res.json({
        ok: true,
        mensaje: 'API de reportes funcionando'
    });

});

app.get('/api/reportes', (req, res) => {

    res.status(200).json({
        ok: true,
        data: reportes
    });

});

app.get('/api/reportes/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const reporte = reportes.find(r => r.id === id);

    if (!reporte) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    res.status(200).json({
        ok: true,
        data: reporte
    });

});

app.post('/api/reportes', (req, res) => {

    const {
        titulo,
        descripcion,
        ubicacion,
        categoria,
        estado
    } = req.body;

    if (!titulo) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El campo titulo es obligatorio'
        });

    }

    if (!descripcion) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El campo descripcion es obligatorio'
        });

    }

    if (!ubicacion) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El campo ubicacion es obligatorio'
        });

    }

    if (!categoria) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El campo categoria es obligatorio'
        });

    }

    if (!estado) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El campo estado es obligatorio'
        });

    }

    const nuevoReporte = {

        id: reportes.length + 1,
        titulo,
        descripcion,
        ubicacion,
        categoria,
        estado

    };

    reportes.push(nuevoReporte);

    res.status(201).json({
        ok: true,
        mensaje: 'Reporte creado correctamente',
        data: nuevoReporte
    });

});

app.put('/api/reportes/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const reporte = reportes.find(r => r.id === id);

    if (!reporte) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    const {
        titulo,
        descripcion,
        ubicacion,
        categoria,
        estado
    } = req.body;

    if (!titulo || !descripcion || !ubicacion || !categoria || !estado) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Todos los campos son obligatorios'
        });

    }

    reporte.titulo = titulo;
    reporte.descripcion = descripcion;
    reporte.ubicacion = ubicacion;
    reporte.categoria = categoria;
    reporte.estado = estado;

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte actualizado correctamente',
        data: reporte
    });

});

app.delete('/api/reportes/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const reporte = reportes.find(r => r.id === id);

    if (!reporte) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    reportes = reportes.filter(r => r.id !== id);

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte eliminado correctamente'
    });

});

app.get('/api/health', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'API activa'
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