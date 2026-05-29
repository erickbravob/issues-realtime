
        const socket = io();

        const estado = document.getElementById('estado');
        const contenedor = document.getElementById('notificaciones');

        socket.on('connect', () => {
            estado.textContent = 'Conectado al servidor en tiempo real';
        });

        socket.on('disconnect', () => {
            estado.textContent = 'Desconectado del servidor';
        });

        function mostrarNotificacionReporte(tituloEvento, evento) {

            const reporte = evento.payload;

            const div = document.createElement('div');
            div.className = 'notificacion';

            div.innerHTML = `
                <div class="titulo">${tituloEvento}: ${reporte.titulo}</div>
                <div class="detalle"><strong>Descripción:</strong> ${reporte.descripcion}</div>
                <div class="detalle"><strong>Ubicación:</strong> ${reporte.ubicacion}</div>
                <div class="detalle"><strong>Categoría:</strong> ${reporte.categoria?.nombre || 'Sin categoría'}</div>
                <div class="detalle"><strong>Estado:</strong> ${reporte.estado}</div>
                <div class="detalle"><strong>Fecha evento:</strong> ${evento.timestamp}</div>
            `;

            contenedor.prepend(div);

        }

        function mostrarNotificacionSeguimiento(tituloEvento, evento) {

            const seguimiento = evento.payload;
            const reporte = seguimiento.reporte || {};

            const div = document.createElement('div');
            div.className = 'notificacion';

            div.innerHTML = `
                <div class="titulo">${tituloEvento}: ${reporte.titulo || 'Reporte sin título'}</div>
                <div class="detalle"><strong>Detalle:</strong> ${seguimiento.detalle}</div>
                <div class="detalle"><strong>Responsable:</strong> ${seguimiento.responsable}</div>
                <div class="detalle"><strong>Reporte ID:</strong> ${seguimiento.reporteId}</div>
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