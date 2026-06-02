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
    
const limpiarMensajeVacio = () => {

    const vacio = contenedor.querySelector('.vacio');

    if (vacio) {
        vacio.remove();
    }

};

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

        return;

    }

    panelLogin.classList.add('oculto');
    panelUsuario.classList.remove('oculto');
    panelNuevoReporte.classList.remove('oculto');
    panelReportes.classList.remove('oculto');
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

        tablaReportes.innerHTML = '';

        datos.data.forEach((reporte) => {

            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${reporte.id}</td>
                <td>${reporte.titulo}</td>
                <td>${reporte.ubicacion}</td>
                <td>${reporte.categoria?.nombre || 'Sin categoría'}</td>
                <td>

                <select
                    onchange="actualizarEstado(${reporte.id}, this.value)"
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
            `;

            tablaReportes.appendChild(fila);

        });

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

btnCargarReportes.addEventListener('click', () => {
    cargarReportes();
});

mostrarUsuario();

