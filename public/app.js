const socket = io();

const API_URL = '';

const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');

const panelLogin = document.getElementById('panelLogin');
const panelUsuario = document.getElementById('panelUsuario');

const email = document.getElementById('email');
const password = document.getElementById('password');

const mensajeLogin = document.getElementById('mensajeLogin');
const usuarioActivo = document.getElementById('usuarioActivo');

const estado = document.getElementById('estado');
const contenedor = document.getElementById('notificaciones');

const panelNuevoReporte =
    document.getElementById('panelNuevoReporte');
const tituloReporte =
    document.getElementById('tituloReporte');
const descripcionReporte =
    document.getElementById('descripcionReporte');
const ubicacionReporte =
    document.getElementById('ubicacionReporte');
const categoriaReporte =
    document.getElementById('categoriaReporte');
const btnCrearReporte =
    document.getElementById('btnCrearReporte');

const panelReportes = document.getElementById('panelReportes');
const btnCargarReportes = document.getElementById('btnCargarReportes');
const tablaReportes = document.getElementById('tablaReportes');

const panelDashboard =
    document.getElementById('panelDashboard');

const totalReportes =
    document.getElementById('totalReportes');

const totalPendientes =
    document.getElementById('totalPendientes');

const totalProceso =
    document.getElementById('totalProceso');

const totalAtendidos =
    document.getElementById('totalAtendidos');

const modalSeguimiento = document.getElementById('modalSeguimiento');
const idReporteSeguimiento = document.getElementById('idReporteSeguimiento');
const detalleSeguimiento = document.getElementById('detalleSeguimiento');
const responsableSeguimiento = document.getElementById('responsableSeguimiento');
const btnGuardarSeguimiento = document.getElementById('btnGuardarSeguimiento');
const btnCancelarSeguimiento = document.getElementById('btnCancelarSeguimiento');

const ultimosReportes = document.getElementById('ultimosReportes');

const buscarReporte =
    document.getElementById('buscarReporte');

const filtroEstado =
    document.getElementById('filtroEstado');
    
const limpiarMensajeVacio = () => {

    const vacio = contenedor.querySelector('.vacio');

    if (vacio) {
        vacio.remove();
    }

};

const graficoEstadosCanvas =
    document.getElementById('graficoEstados');

const graficoCategorias =
    document.getElementById('graficoCategorias');

const graficoUbicaciones =
    document.getElementById('graficoUbicaciones');

let reportesOriginales = [];

socket.on('connect', () => {
    estado.textContent = 'Conectado al servidor en tiempo real';
});

socket.on('disconnect', () => {
    estado.textContent = 'Desconectado del servidor';
});

function mostrarNotificacionReporte(tituloEvento, evento) {

    limpiarMensajeVacio();

    const reporte = evento.payload;

    const div = document.createElement('div');
    div.className = 'notificacion';

    div.innerHTML = `
        <div class="titulo">${tituloEvento}: ${reporte.titulo || 'Sin título'}</div>
        <div class="detalle"><strong>Descripción:</strong> ${reporte.descripcion || 'No registrada'}</div>
        <div class="detalle"><strong>Ubicación:</strong> ${reporte.ubicacion || 'No registrada'}</div>
        <div class="detalle"><strong>Categoría:</strong> ${reporte.categoria?.nombre || 'Sin categoría'}</div>
        <div class="detalle"><strong>Estado:</strong> ${reporte.estado || 'No registrado'}</div>
        <div class="detalle"><strong>Ejecutado por:</strong> ${reporte.usuarioEjecutor?.nombre || 'Usuario no identificado'}</div>
        <div class="detalle"><strong>Email ejecutor:</strong> ${reporte.usuarioEjecutor?.email || 'No registrado'}</div>
        <div class="detalle"><strong>Fecha evento:</strong> ${evento.timestamp}</div>
    `;

    contenedor.prepend(div);

}

function mostrarNotificacionSeguimiento(tituloEvento, evento) {

    limpiarMensajeVacio();

    const seguimiento = evento.payload;
    const reporte = seguimiento.reporte || {};

    const div = document.createElement('div');
    div.className = 'notificacion';

    div.innerHTML = `
        <div class="titulo">${tituloEvento}: ${reporte.titulo || 'Reporte sin título'}</div>
        <div class="detalle"><strong>Detalle:</strong> ${seguimiento.detalle || 'No registrado'}</div>
        <div class="detalle"><strong>Responsable:</strong> ${seguimiento.responsable || 'No registrado'}</div>
        <div class="detalle"><strong>Reporte ID:</strong> ${seguimiento.reporteId || 'No registrado'}</div>
        <div class="detalle"><strong>Ubicación:</strong> ${reporte.ubicacion || 'No registrada'}</div>
        <div class="detalle"><strong>Estado:</strong> ${reporte.estado || 'No registrado'}</div>
        <div class="detalle"><strong>Fecha evento:</strong> ${evento.timestamp}</div>
    `;

    contenedor.prepend(div);

}

socket.on('reporte:creado', (evento) => {
    mostrarNotificacionReporte('Nuevo reporte creado', evento);
});

socket.on('reporte:actualizado', (evento) => {
    mostrarNotificacionReporte('Reporte actualizado', evento);
});

socket.on('reporte:eliminado', (evento) => {
    mostrarNotificacionReporte('Reporte eliminado', evento);
});

socket.on('reporte:seguimiento_creado', (evento) => {
    mostrarNotificacionSeguimiento('Seguimiento registrado', evento);
});

socket.on('reporte:estado_actualizado', (evento) => {
    mostrarNotificacionReporte('Estado del reporte actualizado', evento);
});

btnLogin.addEventListener('click', async () => {

    try {

        mensajeLogin.textContent = 'Iniciando sesión...';

        const respuesta = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const datos = await respuesta.json();

        if (!datos.ok) {

            mensajeLogin.textContent = datos.mensaje;
            return;

        }

        localStorage.setItem('token', datos.token);
        localStorage.setItem('refreshToken', datos.refreshToken);

        localStorage.setItem(
            'usuario',
            JSON.stringify(datos.usuario)
        );

        mostrarUsuario();

        mensajeLogin.textContent = 'Login correcto';

    } catch (error) {

        mensajeLogin.textContent = 'Error al iniciar sesión';

    }

});

function mostrarUsuario() {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    if (!usuario) {

        panelLogin.classList.remove('oculto');
        panelUsuario.classList.add('oculto');
        panelNuevoReporte.classList.add('oculto');
        panelReportes.classList.add('oculto');
        panelDashboard.classList.add('oculto');

        return;

    }

    panelLogin.classList.add('oculto');
    panelUsuario.classList.remove('oculto');
    panelNuevoReporte.classList.remove('oculto');
    panelReportes.classList.remove('oculto');
    panelDashboard.classList.remove('oculto');

    cargarReportes();
    
    usuarioActivo.textContent =
        `${usuario.nombre} (${usuario.email})`;

}

btnLogout.addEventListener('click', async () => {

    try {

        const token = localStorage.getItem('token');

        await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {

        console.error(error);

    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');

    mostrarUsuario();

});

btnCrearReporte.addEventListener('click', async () => {

    try {

        const token = localStorage.getItem('token');

        const respuesta = await fetch('/api/reportes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                titulo: tituloReporte.value,
                descripcion: descripcionReporte.value,
                ubicacion: ubicacionReporte.value,
                categoria: categoriaReporte.value,
                estado: 'Pendiente',
                usuarioNombre: JSON.parse(localStorage.getItem('usuario')).nombre,
                usuarioEmail: JSON.parse(localStorage.getItem('usuario')).email
            })
        });

        const datos = await respuesta.json();

        if (!datos.ok) {

            alert(datos.mensaje);
            return;

        }

        tituloReporte.value = '';
        descripcionReporte.value = '';
        ubicacionReporte.value = '';

        alert('Reporte registrado correctamente');
        cargarReportes();

    } catch (error) {

        console.error(error);

        alert('Error al registrar reporte');

    }

});

const cargarReportes = async () => {

    try {

        tablaReportes.innerHTML = `
            <tr>
                <td colspan="6">Cargando reportes...</td>
            </tr>
        `;

        const respuesta = await fetch('/api/reportes');

        const datos = await respuesta.json();
        reportesOriginales = datos.data || [];

        actualizarDashboard(datos.data || []);
        actualizarUltimosReportes(datos.data || []);
        actualizarGraficoEstados(datos.data || []);
        actualizarGraficoCategorias(datos.data || []);
        actualizarGraficoUbicaciones(datos.data || []);

        if (!datos.ok) {

            tablaReportes.innerHTML = `
                <tr>
                    <td colspan="6">${datos.mensaje || 'No se pudieron cargar los reportes'}</td>
                </tr>
            `;

            return;

        }

        if (!datos.data || datos.data.length === 0) {

            tablaReportes.innerHTML = `
                <tr>
                    <td colspan="6">No existen reportes registrados.</td>
                </tr>
            `;

            return;

        }

    renderizarTabla(reportesOriginales);

    } catch (error) {

        tablaReportes.innerHTML = `
            <tr>
                <td colspan="6">Error al cargar reportes.</td>
            </tr>
        `;

    }
};

window.actualizarEstado = async (
    idReporte,
    nuevoEstado
) => {

    try {

        const token =
            localStorage.getItem('token');

        const respuesta = await fetch(
            `/api/reportes/${idReporte}/estado`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        );

        const datos =
            await respuesta.json();

        if (!datos.ok) {

            alert(datos.mensaje);
            return;

        }

        cargarReportes();

    } catch (error) {

        console.error(error);

        alert(
            'Error actualizando estado'
        );

    }

};

    const actualizarDashboard = (reportes) => {

    const total = reportes.length;

    const pendientes = reportes.filter(
        reporte => reporte.estado === 'Pendiente'
    ).length;

    const enProceso = reportes.filter(
        reporte => reporte.estado === 'En Proceso'
    ).length;

    const atendidos = reportes.filter(
        reporte => reporte.estado === 'Atendido'
    ).length;

    totalReportes.textContent = total;
    totalPendientes.textContent = pendientes;
    totalProceso.textContent = enProceso;
    totalAtendidos.textContent = atendidos;

};

const actualizarUltimosReportes = (reportes) => {

    const ultimos = reportes.slice(0, 5);

    if (ultimos.length === 0) {

        ultimosReportes.innerHTML = `
            <p class="vacio">No hay reportes recientes.</p>
        `;

        return;

    }

    ultimosReportes.innerHTML = '';

    ultimos.forEach((reporte) => {

        const div = document.createElement('div');
        div.className = 'reporte-reciente';

        div.innerHTML = `
            <strong>${reporte.titulo}</strong>
            <div class="detalle">Ubicación: ${reporte.ubicacion}</div>
            <div class="detalle">Estado: ${reporte.estado}</div>
            <div class="detalle">Registrado por: ${reporte.usuario?.nombre || 'Sin usuario'}</div>
        `;

        ultimosReportes.appendChild(div);

    });

};

const actualizarGraficoEstados = (reportes) => {

    const pendientes = reportes.filter(
        reporte => reporte.estado === 'Pendiente'
    ).length;

    const enProceso = reportes.filter(
        reporte => reporte.estado === 'En Proceso'
    ).length;

    const atendidos = reportes.filter(
        reporte => reporte.estado === 'Atendido'
    ).length;

    const maximo = Math.max(
        pendientes,
        enProceso,
        atendidos,
        1
    );

    graficoEstadosCanvas.innerHTML = `
        <div class="barra-estado">
            <strong>Pendientes</strong>
            <div class="barra" style="width: ${(pendientes / maximo) * 100}%"></div>
            <span>${pendientes}</span>
        </div>

        <div class="barra-estado">
            <strong>En Proceso</strong>
            <div class="barra" style="width: ${(enProceso / maximo) * 100}%"></div>
            <span>${enProceso}</span>
        </div>

        <div class="barra-estado">
            <strong>Atendidos</strong>
            <div class="barra" style="width: ${(atendidos / maximo) * 100}%"></div>
            <span>${atendidos}</span>
        </div>
    `;

};

    const actualizarGraficoCategorias = (reportes) => {

        const categorias = {};

        reportes.forEach((reporte) => {

            const nombreCategoria =
                reporte.categoria?.nombre ||
                'Sin categoría';

            categorias[nombreCategoria] =
                (categorias[nombreCategoria] || 0) + 1;

        });

        const datos =
            Object.entries(categorias);

        if (datos.length === 0) {

            graficoCategorias.innerHTML =
                '<p class="vacio">No hay datos disponibles.</p>';

            return;

        }

        const maximo =
            Math.max(
                ...datos.map(item => item[1]),
                1
            );

        graficoCategorias.innerHTML = '';

        datos.forEach(([nombre, cantidad]) => {

            const fila =
                document.createElement('div');

            fila.className =
                'barra-estado';

            fila.innerHTML = `
                <strong>${nombre}</strong>
                <div
                    class="barra"
                    style="width:${(cantidad / maximo) * 100}%"
                ></div>
                <span>${cantidad}</span>
            `;

            graficoCategorias.appendChild(fila);

        });

    };

    const actualizarGraficoUbicaciones = (reportes) => {

    const ubicaciones = {};

    reportes.forEach((reporte) => {

        const nombreUbicacion =
            reporte.ubicacion ||
            'Sin ubicación';

        ubicaciones[nombreUbicacion] =
            (ubicaciones[nombreUbicacion] || 0) + 1;

    });

    const datos =
        Object.entries(ubicaciones);

    if (datos.length === 0) {

        graficoUbicaciones.innerHTML =
            '<p class="vacio">No hay datos disponibles.</p>';

        return;

    }

    const maximo =
        Math.max(
            ...datos.map(item => item[1]),
            1
        );

    graficoUbicaciones.innerHTML = '';

    datos.forEach(([nombre, cantidad]) => {

        const fila =
            document.createElement('div');

        fila.className =
            'barra-estado';

        fila.innerHTML = `
            <strong>${nombre}</strong>
            <div
                class="barra"
                style="width:${(cantidad / maximo) * 100}%"
            ></div>
            <span>${cantidad}</span>
        `;

        graficoUbicaciones.appendChild(fila);

    });

};

        const aplicarFiltros = () => {

            const textoBusqueda =
                buscarReporte.value
                    .toLowerCase()
                    .trim();

            const estadoSeleccionado =
                filtroEstado.value;

            const reportesFiltrados =
                reportesOriginales.filter((reporte) => {

                    const coincideTexto =

                        reporte.titulo?.toLowerCase().includes(textoBusqueda)

                        ||

                        reporte.ubicacion?.toLowerCase().includes(textoBusqueda)

                        ||

                        reporte.usuario?.nombre?.toLowerCase().includes(textoBusqueda);

                    const coincideEstado =

                        !estadoSeleccionado ||

                        reporte.estado === estadoSeleccionado;

                    return (
                        coincideTexto &&
                        coincideEstado
                    );

                });

            renderizarTabla(reportesFiltrados);

        };

        const renderizarTabla = (reportes) => {

        tablaReportes.innerHTML = '';

            if (reportes.length === 0) {

                tablaReportes.innerHTML = `
                    <tr>
                        <td colspan="7">
                            No se encontraron reportes.
                        </td>
                    </tr>
                `;

                return;

            }

        reportes.forEach((reporte) => {

            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${reporte.id}</td>
                <td>${reporte.titulo}</td>
                <td>${reporte.ubicacion}</td>
                <td>${reporte.categoria?.nombre || 'Sin categoría'}</td>
                <td>

                    <select
                        class="selectEstado"
                        data-id="${reporte.id}"
                    >
                        <option
                            value="Pendiente"
                            ${reporte.estado === 'Pendiente' ? 'selected' : ''}
                        >
                            Pendiente
                        </option>

                        <option
                            value="En Proceso"
                            ${reporte.estado === 'En Proceso' ? 'selected' : ''}
                        >
                            En Proceso
                        </option>

                        <option
                            value="Atendido"
                            ${reporte.estado === 'Atendido' ? 'selected' : ''}
                        >
                            Atendido
                        </option>

                    </select>

                </td>

                <td>${reporte.usuario?.nombre || 'Sin usuario'}</td>

                <td>
                    <button
                        class="btnSeguimiento"
                        data-id="${reporte.id}"
                    >
                        Seguimiento
                    </button>
                </td>
            `;

            tablaReportes.appendChild(fila);

        });

    };

window.registrarSeguimiento = (idReporte) => {

    idReporteSeguimiento.value = idReporte;
    detalleSeguimiento.value = '';
    responsableSeguimiento.value = '';

    modalSeguimiento.classList.remove('oculto');

};

btnCargarReportes.addEventListener('click', () => {
    cargarReportes();
});

tablaReportes.addEventListener('click', (event) => {

    const boton = event.target.closest('.btnSeguimiento');

    if (!boton) {
        return;
    }

    registrarSeguimiento(boton.dataset.id);

});

tablaReportes.addEventListener('change', (event) => {

    const select = event.target.closest('.selectEstado');

    if (!select) {
        return;
    }

    actualizarEstado(select.dataset.id, select.value);

});

btnCancelarSeguimiento.addEventListener('click', () => {

    modalSeguimiento.classList.add('oculto');

});

btnGuardarSeguimiento.addEventListener('click', async () => {

    try {

        const token = localStorage.getItem('token');

        const respuesta = await fetch(
            `/api/reportes/seguimiento/${idReporteSeguimiento.value}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    detalle: detalleSeguimiento.value,
                    responsable: responsableSeguimiento.value
                })
            }
        );

        const datos = await respuesta.json();

        if (!datos.ok) {

            alert(datos.mensaje);
            return;

        }

        modalSeguimiento.classList.add('oculto');

        detalleSeguimiento.value = '';
        responsableSeguimiento.value = '';

        alert('Seguimiento registrado correctamente');

        cargarReportes();

    } catch (error) {

        console.error(error);

        alert('Error registrando seguimiento');

    }

});

buscarReporte.addEventListener(
    'input',
    aplicarFiltros
);

filtroEstado.addEventListener(
    'change',
    aplicarFiltros
);

mostrarUsuario();

