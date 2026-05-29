# API REST — Issues Realtime v4.4.0

## Programación IV – Universidad Privada Domingo Savio (UPDS)

**Autor:** Erick Bravo Borges
**Gestión:** 2026
**Materia:** Programación IV
**Proyecto Final:** Sistema Distribuido de Reportes de Infraestructura Universitaria

---

# Descripción General

Issues Realtime es una plataforma backend distribuida desarrollada progresivamente durante las actividades académicas de la materia Programación IV.

El sistema permite registrar, consultar, actualizar, monitorear y dar seguimiento a problemas de infraestructura universitaria mediante una arquitectura moderna basada en API REST, PostgreSQL Cloud, Redis, Socket.IO y mecanismos avanzados de seguridad.

La aplicación fue evolucionando actividad tras actividad hasta convertirse en una solución backend profesional que incorpora:

* Persistencia cloud.
* Comunicación distribuida.
* Notificaciones en tiempo real.
* Cache distribuido.
* Documentación interactiva.
* Pruebas automatizadas.
* Seguridad JWT.
* Protección de endpoints.
* Control de sesiones.
* Arquitectura escalable.

---

# Objetivo del Proyecto

Digitalizar el proceso de reporte y seguimiento de incidencias de infraestructura universitaria, permitiendo gestionar eventos como:

* Luminarias dañadas.
* Fugas de agua.
* Problemas eléctricos.
* Daños en aulas.
* Cableado defectuoso.
* Equipos averiados.
* Problemas de mantenimiento institucional.

---

# Tecnologías Utilizadas

| Tecnología            | Uso                     |
| --------------------- | ----------------------- |
| Node.js               | Entorno de ejecución    |
| Express.js            | API REST                |
| Prisma ORM            | Acceso a datos          |
| PostgreSQL (Supabase) | Persistencia cloud      |
| Redis (Upstash)       | Cache y Pub/Sub         |
| Socket.IO             | Tiempo real             |
| Swagger/OpenAPI       | Documentación           |
| JWT                   | Autenticación           |
| bcryptjs              | Cifrado de contraseñas  |
| Helmet                | Seguridad HTTP          |
| Express Rate Limit    | Protección contra abuso |
| Jest                  | Pruebas automatizadas   |
| Supertest             | Testing API             |
| dotenv                | Variables de entorno    |
| Git/GitHub            | Versionamiento          |
| Render                | Despliegue cloud        |

---

# Arquitectura General

```text
Cliente Web
      │
      ▼
Swagger / Navegador
      │
      ▼
API REST Express
      │
      ├──────────────► JWT Authentication
      │
      ├──────────────► Redis Cache
      │
      ├──────────────► Redis Pub/Sub
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL Cloud
      │
      ▼
Eventos Redis
      │
      ▼
Subscriber Redis
      │
      ▼
Socket.IO
      │
      ▼
Notificaciones en Tiempo Real
```

---

# Estructura Actual del Proyecto

```text
ISSUES_REALTIME/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── pruebas/
│   └── api.prueba.js
│
├── public/
│   └── index.html
│
├── src/
│
│   ├── config/
│   │   └── prisma.client.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── reportes.controller.js
│   │
│   ├── docs/
│   │   └── swagger.js
│   │
│   ├── middlewares/
│   │   ├── autenticar.js
│   │   └── rateLimit.js
│   │
│   ├── redis/
│   │   ├── redis.client.js
│   │   ├── redis.publisher.js
│   │   └── redis.subscriber.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── reportes.routes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# Modelo de Datos

## Usuario

Representa la persona que utiliza el sistema.

Campos:

* id
* nombre
* email
* password
* createdAt

---

## Categoria

Clasificación de reportes.

Campos:

* id
* nombre
* createdAt

---

## Reporte

Representa una incidencia de infraestructura.

Campos:

* id
* titulo
* descripcion
* ubicacion
* estado
* usuarioId
* categoriaId
* createdAt
* updatedAt

---

## SeguimientoReporte

Historial de atención.

Campos:

* id
* detalle
* responsable
* fecha
* reporteId
* createdAt

---

## RefreshToken

Control de renovación de sesiones.

Campos:

* id
* token
* usuarioId
* expiresAt
* createdAt

---

# Funcionalidades Implementadas

## Gestión de Reportes

✅ CRUD completo

✅ Búsqueda

✅ Filtros

✅ Paginación

✅ Seguimiento

✅ Cambio de estado

---

## Persistencia

✅ PostgreSQL Cloud

✅ Prisma ORM

✅ Migraciones

✅ Relaciones entre entidades

---

## Redis

✅ Cache distribuido

✅ Invalidación automática

✅ Pub/Sub

✅ Eventos estructurados

---

## Tiempo Real

✅ Socket.IO

✅ Eventos en navegador

✅ Seguimientos en tiempo real

✅ Cambio de estado en tiempo real

---

## Seguridad

✅ JWT Authentication

✅ Refresh Tokens

✅ Logout Seguro

✅ Blacklist Redis

✅ Middleware JWT

✅ Swagger Authorize

✅ Helmet

✅ Rate Limiting

---

## Calidad

✅ Swagger

✅ Jest

✅ Supertest

✅ Variables de entorno

✅ Arquitectura MVC

---

# Endpoints Principales

## Autenticación

| Método | Ruta           | Descripción       |
| ------ | -------------- | ----------------- |
| POST   | /auth/register | Registrar usuario |
| POST   | /auth/login    | Iniciar sesión    |
| POST   | /auth/refresh  | Renovar JWT       |
| POST   | /auth/logout   | Cerrar sesión     |

---

## Reportes

| Método | Ruta                     |
| ------ | ------------------------ |
| GET    | /api/reportes            |
| GET    | /api/reportes/:id        |
| POST   | /api/reportes            |
| PUT    | /api/reportes/:id        |
| PATCH  | /api/reportes/:id/estado |
| DELETE | /api/reportes/:id        |

---

## Seguimientos

| Método | Ruta                          |
| ------ | ----------------------------- |
| POST   | /api/reportes/seguimiento/:id |

---

## Utilitarios

| Método | Ruta        |
| ------ | ----------- |
| GET    | /api/health |
| GET    | /api/info   |
| GET    | /api-docs   |

---

# Seguridad Implementada

## JWT Authentication

El sistema utiliza Access Tokens para autenticación.

Proceso:

```text
Login
  ↓
JWT
  ↓
Acceso a rutas protegidas
```

---

## Refresh Token

Permite renovar sesiones sin volver a solicitar credenciales.

```text
JWT expira
     ↓
Refresh Token
     ↓
Nuevo JWT
```

---

## Logout Seguro

Cuando un usuario cierra sesión:

```text
Token JWT
      ↓
Redis Blacklist
      ↓
Token inválido inmediatamente
```

---

## Helmet

Protección mediante:

* Content-Security-Policy
* X-Frame-Options
* X-Content-Type-Options
* Strict-Transport-Security
* Cross-Origin-Policies

---

## Rate Limiting

Configuración:

```text
100 solicitudes
cada 15 minutos
por IP
```

---

# Redis Pub/Sub

Canales:

```text
infra:reportes
infra:notificaciones
```

Eventos:

```text
infra:reporte:creado
infra:reporte:actualizado
infra:reporte:eliminado
infra:reporte:seguimiento_creado
infra:reporte:estado_actualizado
infra:notificacion:mantenimiento
```

---

# Redis Cache

Endpoint optimizado:

```text
GET /api/reportes
```

Estrategia:

* Cachear consultas frecuentes.
* Reutilizar respuestas.
* Invalidar automáticamente ante cambios.

---

# Socket.IO

Eventos emitidos:

```text
reporte:creado
reporte:actualizado
reporte:eliminado
reporte:seguimiento_creado
reporte:estado_actualizado
```

Panel tiempo real:

```text
GET /
```

---

# Variables de Entorno

```env
PORT=3000

DATABASE_URL=

DIRECT_URL=

REDIS_URL=

JWT_SECRET=

JWT_EXPIRES_IN=1h

JWT_REFRESH_EXPIRES_IN=7d
```

---

# Instalación Local

## Dependencias

```bash
npm install
```

## Prisma

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

## Ejecutar API

```bash
npm start
```

## Ejecutar Subscriber

```bash
npm run subscriber
```

## Pruebas

```bash
npm test
```

---

# Scripts

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "subscriber": "node src/redis/redis.subscriber.js",
  "test": "jest --detectOpenHandles --forceExit"
}
```

---

# Producción

## API

```text
https://issues-realtime.onrender.com
```

## Swagger

```text
https://issues-realtime.onrender.com/api-docs
```

## Health Check

```text
https://issues-realtime.onrender.com/api/health
```

---

# Pruebas Automatizadas

Endpoints validados:

```text
GET /api/health
GET /api/info
GET /api/reportes
PATCH /api/reportes/:id/estado
```

Resultado esperado:

```text
PASS
4 passed
0 failed
```

---

# Evolución Histórica del Proyecto

## v1.0.0 — Actividad 1

Implementación inicial:

* API REST
* CRUD básico
* Express
* MVC
* Swagger
* Variables de entorno
* Deploy inicial

---

## v1.1.0

* Búsqueda
* Filtros
* Paginación

---

## v1.2.0

* Mejoras Swagger
* Validaciones

---

## v2.0.0 — Actividad 2

Comunicación distribuida:

* Redis Pub/Sub
* Eventos JSON
* Subscriber independiente

---

## v2.1.0

* Socket.IO
* Tiempo real

---

## v2.2.0

* Eventos estructurados
* Mejoras realtime

---

## v3.0.0 — Actividad 3

Persistencia Cloud:

* Prisma ORM
* PostgreSQL
* Supabase
* Migraciones
* Relaciones

---

## v3.1.0

* Seguimiento de reportes

---

## v3.2.0

* Redis Cache

---

## v3.3.0

* Jest
* Supertest

---

## v3.4.0

* Estado independiente mediante PATCH

---

## v3.5.0

* Seguimientos realtime
* Estado realtime

---

## v4.0.0 — Actividad 4

Seguridad:

* JWT Authentication
* Register
* Login

---

## v4.1.0

* Refresh Token

---

## v4.2.0

* Swagger Authorize
* Bearer Authentication

---

## v4.3.0

* Helmet
* Rate Limiting

---

## v4.4.0

* Logout Seguro
* Redis Blacklist
* Revocación de JWT
* Protección avanzada de sesiones

---

## v4.4.1

* Corrección de Content Security Policy (Helmet)
* Migración de JavaScript inline a archivo externo
* Restablecimiento de Socket.IO en producción
* Compatibilidad completa con CSP

---

# Commits Semánticos

Ejemplos:

```text
feat: crear estructura inicial de la api
feat: agregar swagger a la api
feat: implementar redis pubsub
feat: integrar prisma con supabase
feat: agregar socket io realtime
feat: implementar jwt authentication
feat: implementar refresh token
feat: agregar helmet y rate limiting
feat: implementar logout y blacklist jwt en redis
docs: actualizar readme
fix: corregir configuracion prisma
```

---

# Decisiones Técnicas

### ¿Por qué PostgreSQL?

Persistencia real y relaciones estructuradas.

### ¿Por qué Redis?

Pub/Sub, Cache y Blacklist JWT.

### ¿Por qué Prisma?

Migraciones automáticas y acceso tipado.

### ¿Por qué Socket.IO?

Tiempo real sin recargar navegador.

### ¿Por qué JWT?

Autenticación escalable sin sesiones tradicionales.

### ¿Por qué Refresh Tokens?

Renovación segura de sesiones.

### ¿Por qué Redis Blacklist?

Permite invalidar tokens antes de su expiración natural.

---

# Autor

**Erick Bravo Borges**

Programación IV

Universidad Privada Domingo Savio

Gestión 2026
