const { reportes } = require('../data/reportes.data');
const { publicarEvento } = require('../redis/redis.publisher');


const listarReportes = (req, res) => {

    const { q, estado, categoria, page = 1, limit = 10 } = req.query;

    let resultado = [...reportes];

    if (q) {
        const textoBusqueda = q.toLowerCase();

        resultado = resultado.filter(reporte =>
            reporte.titulo.toLowerCase().includes(textoBusqueda) ||
            reporte.descripcion.toLowerCase().includes(textoBusqueda) ||
            reporte.ubicacion.toLowerCase().includes(textoBusqueda)
        );
    }

    if (estado) {
        resultado = resultado.filter(reporte =>
            reporte.estado.toLowerCase() === estado.toLowerCase()
        );
    }

    if (categoria) {
        resultado = resultado.filter(reporte =>
            reporte.categoria.toLowerCase() === categoria.toLowerCase()
        );
    }

    const pagina = parseInt(page);
    const limite = parseInt(limit);
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;

    const datosPaginados = resultado.slice(inicio, fin);

    res.status(200).json({
        ok: true,
        total: resultado.length,
        pagina,
        limite,
        data: datosPaginados
    });

};

const obtenerReportePorId = (req, res) => {

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

};

const crearReporte = async (req, res) => {

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

    const nuevoReporte = {
        id: reportes.length + 1,
        titulo,
        descripcion,
        ubicacion,
        categoria,
        estado
    };

    reportes.push(nuevoReporte);

    await publicarEvento(
        'infra:reporte:creado',
        nuevoReporte
    );

    const io = req.app.get('io');

    io.emit('reporte:creado', {
        tipo: 'infra:reporte:creado',
        payload: nuevoReporte,
        timestamp: new Date().toISOString(),
        version: '1.0'
    });

    res.status(201).json({
        ok: true,
        mensaje: 'Reporte creado correctamente',
        data: nuevoReporte
    });

};

const actualizarReporte = (req, res) => {

    const id = parseInt(req.params.id);

    const reporte = reportes.find(r => r.id === id);

    if (!reporte) {
        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });
    }

    const { titulo, descripcion, ubicacion, categoria, estado } = req.body;

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

};

const eliminarReporte = (req, res) => {

    const id = parseInt(req.params.id);

    const indice = reportes.findIndex(r => r.id === id);

    if (indice === -1) {
        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });
    }

    reportes.splice(indice, 1);

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte eliminado correctamente'
    });

};

module.exports = {
    listarReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte
};