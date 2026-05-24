const prisma = require('../config/prisma.client');
const { publicarEvento } = require('../redis/redis.publisher');

const {
    guardarCache,
    obtenerCache,
    eliminarCachePorPatron
} = require('../redis/redis.client');

const listarReportes = async (req, res) => {

    const { q, estado, categoria, page = 1, limit = 10 } = req.query;

    const claveCache = `reportes:${q || 'all'}:${estado || 'all'}:${categoria || 'all'}:${page}:${limit}`;

    const datosCache = await obtenerCache(claveCache);

    if (datosCache) {

        return res.status(200).json({
            ok: true,
            cache: true,
            ...datosCache
        });

    }

    const pagina = parseInt(page);
    const limite = parseInt(limit);
    const salto = (pagina - 1) * limite;

    const filtros = {};

    if (q) {
        filtros.OR = [
            {
                titulo: {
                    contains: q,
                    mode: 'insensitive'
                }
            },
            {
                descripcion: {
                    contains: q,
                    mode: 'insensitive'
                }
            },
            {
                ubicacion: {
                    contains: q,
                    mode: 'insensitive'
                }
            }
        ];
    }

    if (estado) {
        filtros.estado = {
            equals: estado,
            mode: 'insensitive'
        };
    }

    if (categoria) {
        filtros.categoria = {
            nombre: {
                equals: categoria,
                mode: 'insensitive'
            }
        };
    }

    const total = await prisma.reporte.count({
        where: filtros
    });

    const reportes = await prisma.reporte.findMany({
        where: filtros,
        include: {
            usuario: true,
            categoria: true
        },
        skip: salto,
        take: limite,
        orderBy: {
            createdAt: 'desc'
        }
    });

    const respuesta = {
        total,
        pagina,
        limite,
        data: reportes
    };

    await guardarCache(claveCache, respuesta, 60);

    res.status(200).json({
        ok: true,
        cache: false,
        ...respuesta
    });

};

const obtenerReportePorId = async (req, res) => {

    const id = parseInt(req.params.id);

    const reporte = await prisma.reporte.findUnique({
        where: {
            id
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

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
        estado,
        usuarioNombre,
        usuarioEmail
    } = req.body;

    if (!titulo || !descripcion || !ubicacion || !categoria || !estado || !usuarioNombre || !usuarioEmail) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Todos los campos son obligatorios'
        });

    }

    const usuario = await prisma.usuario.upsert({
        where: {
            email: usuarioEmail
        },
        update: {
            nombre: usuarioNombre
        },
        create: {
            nombre: usuarioNombre,
            email: usuarioEmail
        }
    });

    const categoriaRegistro = await prisma.categoria.upsert({
        where: {
            nombre: categoria
        },
        update: {},
        create: {
            nombre: categoria
        }
    });

    const nuevoReporte = await prisma.reporte.create({
        data: {
            titulo,
            descripcion,
            ubicacion,
            estado,
            usuarioId: usuario.id,
            categoriaId: categoriaRegistro.id
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

    await eliminarCachePorPatron('reportes:*');

    await publicarEvento(
        'infra:reportes',
        'infra:reporte:creado',
        nuevoReporte
    );

    await publicarEvento(
        'infra:notificaciones',
        'infra:notificacion:mantenimiento',
        {
            mensaje: 'Nuevo reporte de infraestructura registrado',
            reporte: nuevoReporte
        }
    );

    const io = req.app.get('io');

    if (io) {

        io.emit('reporte:creado', {
            tipo: 'infra:reporte:creado',
            payload: nuevoReporte,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });

    }

    res.status(201).json({
        ok: true,
        mensaje: 'Reporte creado correctamente',
        data: nuevoReporte
    });

};

const actualizarReporte = async (req, res) => {

    const id = parseInt(req.params.id);

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

    const reporteExiste = await prisma.reporte.findUnique({
        where: {
            id
        }
    });

    if (!reporteExiste) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    const categoriaRegistro = await prisma.categoria.upsert({
        where: {
            nombre: categoria
        },
        update: {},
        create: {
            nombre: categoria
        }
    });

    const reporte = await prisma.reporte.update({
        where: {
            id
        },
        data: {
            titulo,
            descripcion,
            ubicacion,
            estado,
            categoriaId: categoriaRegistro.id
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

    await eliminarCachePorPatron('reportes:*');

    await publicarEvento(
        'infra:reportes',
        'infra:reporte:actualizado',
        reporte
    );

    await publicarEvento(
        'infra:notificaciones',
        'infra:notificacion:mantenimiento',
        {
            mensaje: 'Reporte de infraestructura actualizado',
            reporte
        }
    );

    const io = req.app.get('io');

    if (io) {

        io.emit('reporte:actualizado', {
            tipo: 'infra:reporte:actualizado',
            payload: reporte,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });

    }

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte actualizado correctamente',
        data: reporte
    });

};

const eliminarReporte = async (req, res) => {

    const id = parseInt(req.params.id);

    const reporteExiste = await prisma.reporte.findUnique({
        where: {
            id
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

    if (!reporteExiste) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    const reporteEliminado = await prisma.reporte.delete({
        where: {
            id
        }
    });

    await eliminarCachePorPatron('reportes:*');

    await publicarEvento(
        'infra:reportes',
        'infra:reporte:eliminado',
        reporteExiste
    );

    await publicarEvento(
        'infra:notificaciones',
        'infra:notificacion:mantenimiento',
        {
            mensaje: 'Reporte de infraestructura eliminado',
            reporte: reporteExiste
        }
    );

    const io = req.app.get('io');

    if (io) {

        io.emit('reporte:eliminado', {
            tipo: 'infra:reporte:eliminado',
            payload: reporteExiste,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });

    }    

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte eliminado correctamente',
        data: reporteEliminado
    });

};

const crearSeguimientoReporte = async (req, res) => {

    const id = parseInt(req.params.id);

    const {
        detalle,
        responsable
    } = req.body;

    if (!detalle || !responsable) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Los campos detalle y responsable son obligatorios'
        });

    }

    const reporteExiste = await prisma.reporte.findUnique({
        where: {
            id
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

    if (!reporteExiste) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    const seguimiento = await prisma.seguimientoReporte.create({
        data: {
            detalle,
            responsable,
            reporteId: id
        },
        include: {
            reporte: {
                include: {
                    usuario: true,
                    categoria: true
                }
            }
        }
    });

    await eliminarCachePorPatron('reportes:*');

    await publicarEvento(
        'infra:reportes',
        'infra:reporte:seguimiento_creado',
        seguimiento
    );

    await publicarEvento(
        'infra:notificaciones',
        'infra:notificacion:mantenimiento',
        {
            mensaje: 'Se registró un nuevo seguimiento del reporte',
            seguimiento
        }
    );

    const io = req.app.get('io');

    if (io) {

        io.emit('reporte:seguimiento_creado', {
            tipo: 'infra:reporte:seguimiento_creado',
            payload: seguimiento,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });

    }

    res.status(201).json({
        ok: true,
        mensaje: 'Seguimiento registrado correctamente',
        data: seguimiento
    });

};

const actualizarEstadoReporte = async (req, res) => {

    const id = parseInt(req.params.id);

    const {
        estado
    } = req.body;

    if (!estado) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El estado es obligatorio'
        });

    }

    const reporteExiste = await prisma.reporte.findUnique({
        where: {
            id
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

    if (!reporteExiste) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Reporte no encontrado'
        });

    }

    const reporteActualizado = await prisma.reporte.update({
        where: {
            id
        },
        data: {
            estado
        },
        include: {
            usuario: true,
            categoria: true
        }
    });

    await eliminarCachePorPatron('reportes:*');

    await publicarEvento(
        'infra:reportes',
        'infra:reporte:estado_actualizado',
        reporteActualizado
    );

    await publicarEvento(
        'infra:notificaciones',
        'infra:notificacion:mantenimiento',
        {
            mensaje: 'Estado del reporte actualizado',
            reporte: reporteActualizado
        }
    );

    const io = req.app.get('io');

    if (io) {

        io.emit('reporte:estado_actualizado', {
            tipo: 'infra:reporte:estado_actualizado',
            payload: reporteActualizado,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });

    }    

    res.status(200).json({
        ok: true,
        mensaje: 'Estado actualizado correctamente',
        data: reporteActualizado
    });

};

module.exports = {
    listarReportes,
    obtenerReportePorId,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    crearSeguimientoReporte,
    actualizarEstadoReporte
};