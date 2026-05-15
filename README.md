# API REST - Reportes de Infraestructura Universitaria

Actividad 1 de Programación IV — Universidad Privada Domingo Savio

## Descripción

Esta API REST permite gestionar reportes de problemas de infraestructura universitaria, por ejemplo:

- luminarias quemadas
- baños dañados
- equipos rotos
- problemas eléctricos
- incidencias de mantenimiento

La API fue desarrollada con Node.js y Express siguiendo arquitectura REST.

---

## Tecnologías utilizadas

- Node.js
- Express
- dotenv
- Thunder Client
- GitHub

---

## Endpoints

### Obtener todos los reportes

GET

```http
/api/reportes
```

---

### Obtener reporte por ID

GET

```http
/api/reportes/:id
```

---

### Crear reporte

POST

```http
/api/reportes
```

---

### Actualizar reporte

PUT

```http
/api/reportes/:id
```

---

### Eliminar reporte

DELETE

```http
/api/reportes/:id
```

---

## Códigos de respuesta

- 200 OK
- 201 Created
- 400 Bad Request
- 404 Not Found

---

## Variables de entorno

Archivo `.env`

```env
PORT=3000
```

---

## Ejecutar proyecto

Instalar dependencias:

```bash
npm install
```

Ejecutar servidor:

```bash
npm start
```

---

## URL de producción

Pendiente de despliegue en Render o Railway.