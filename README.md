# API REST - Reportes de Infraestructura Universitaria

Actividad 1 de Programación IV — Universidad Privada Domingo Savio

---

# Descripción

Esta API REST permite gestionar reportes de problemas de infraestructura universitaria, por ejemplo:

* luminarias quemadas
* baños dañados
* equipos rotos
* problemas eléctricos
* incidencias de mantenimiento

La API fue desarrollada con Node.js y Express utilizando arquitectura REST y estructura MVC básica.

---

# Tecnologías utilizadas

* Node.js
* Express
* dotenv
* Thunder Client
* Git
* GitHub
* Render

---

# Arquitectura del proyecto

```text
src
│
├── controllers
├── data
├── routes
└── server.js
```

---

# Endpoints principales

## Obtener todos los reportes

GET

```http
/api/reportes
```

---

## Obtener reporte por ID

GET

```http
/api/reportes/:id
```

---

## Crear reporte

POST

```http
/api/reportes
```

---

## Actualizar reporte

PUT

```http
/api/reportes/:id
```

---

## Eliminar reporte

DELETE

```http
/api/reportes/:id
```

---

# Endpoints adicionales

## Estado de la API

GET

```http
/api/health
```

---

## Información de la API

GET

```http
/api/info
```

---

# Funcionalidades avanzadas

## Búsqueda

```http
/api/reportes?q=luminaria
```

---

## Filtro por estado

```http
/api/reportes?estado=Pendiente
```

---

## Filtro por categoría

```http
/api/reportes?categoria=Iluminación
```

---

## Paginación

```http
/api/reportes?page=1&limit=1
```

---

# Códigos de respuesta HTTP

* 200 OK
* 201 Created
* 400 Bad Request
* 404 Not Found
* 500 Internal Server Error

---

# Variables de entorno

Archivo `.env`

```env
PORT=3000
```

---

# Instalación del proyecto

## Instalar dependencias

```bash
npm install
```

## Ejecutar servidor

```bash
npm start
```

---

# URL de producción

https://actividad-1-api-reportes.onrender.com/api/reportes
https://actividad-1-api-reportes.onrender.com/api-docs (Swagger)

---

# Autor

Erick Bravo
Programación IV
Universidad Privada Domingo Savio
