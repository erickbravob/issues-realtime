API REST — Issues Realtime

Proyecto desarrollado para la materia Programación IV de la Universidad Privada Domingo Savio (UPDS).

El sistema implementa una arquitectura distribuida basada en API REST, PostgreSQL cloud, Redis Pub/Sub, caché distribuido y notificaciones en tiempo real mediante Socket.IO, tomando como referencia la arquitectura propuesta en el texto guía de StudySync adaptada al proyecto final de infraestructura universitaria.

Descripción

El sistema permite registrar, consultar, actualizar y eliminar reportes relacionados con problemas de infraestructura universitaria, tales como:

luminarias dañadas,
fugas de agua,
cableado defectuoso,
problemas eléctricos,
daños en aulas,
mantenimiento institucional.

Además, el sistema implementa comunicación en tiempo real utilizando Redis Pub/Sub y Socket.IO, permitiendo que los eventos generados por la API sean enviados automáticamente a clientes conectados desde navegador.

El proyecto fue evolucionando incrementalmente por actividades académicas hasta convertirse en la base arquitectónica del proyecto final de Programación IV.

Tecnologías utilizadas
Tecnología	Uso en el sistema
Node.js + Express	API REST y servidor backend
Prisma ORM	Acceso y modelado de base de datos
Supabase PostgreSQL	Persistencia cloud de datos
Upstash Redis	Redis Pub/Sub y caché
Socket.IO	Comunicación en tiempo real
Swagger/OpenAPI	Documentación interactiva
Jest + Supertest	Pruebas automatizadas
dotenv	Variables de entorno
Git y GitHub	Control de versiones
Render	Despliegue cloud
Docker (planificado)	Contenerización futura
Arquitectura del sistema
Cliente Web / Swagger
        ↓
API REST Express
        ↓
Supabase PostgreSQL
        ↓
Redis Pub/Sub
        ↓
Subscriber Redis
        ↓
Socket.IO
        ↓
Navegador en tiempo real

La arquitectura implementada sigue el enfoque distribuido propuesto por el texto guía de Programación IV, integrando API REST, Redis Pub/Sub y base de datos cloud dentro de una misma solución cohesiva.

Estructura del proyecto
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
│   ├── config/
│   │   └── prisma.client.js
│   │
│   ├── controllers/
│   │   └── reportes.controller.js
│   │
│   ├── docs/
│   │   └── swagger.js
│   │
│   ├── redis/
│   │   ├── redis.client.js
│   │   ├── redis.publisher.js
│   │   └── redis.subscriber.js
│   │
│   ├── routes/
│   │   └── reportes.routes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
Modelo de datos
Usuario

Representa a la persona que registra un reporte.

Campos principales:

id
nombre
email
createdAt
Categoria

Representa la clasificación del reporte.

Campos principales:

id
nombre
createdAt
Reporte

Representa el problema de infraestructura reportado.

Campos principales:

id
titulo
descripcion
ubicacion
estado
usuarioId
categoriaId
createdAt
updatedAt
SeguimientoReporte

Representa el historial y seguimiento de atención de un reporte.

Campos principales:

id
detalle
responsable
fecha
reporteId
createdAt
Funcionalidades implementadas

✅ CRUD completo de reportes
✅ Persistencia real en PostgreSQL cloud
✅ Redis Pub/Sub funcional
✅ Eventos en tiempo real con Socket.IO
✅ Swagger/OpenAPI
✅ Arquitectura MVC
✅ Relaciones entre tablas
✅ Migraciones Prisma
✅ Variables de entorno
✅ Producción en Render
✅ Búsqueda, filtros y paginación
✅ Subscriber independiente Redis
✅ Eventos tipados JSON
✅ Caché Redis para lecturas frecuentes
✅ Invalidación automática de caché
✅ Seguimiento de reportes en tiempo real
✅ Cambio de estado independiente mediante PATCH
✅ Eventos Socket.IO para seguimiento y actualización de estado
✅ Pruebas automatizadas para endpoints críticos
✅ Pruebas automatizadas con Jest y Supertest

Endpoints principales
Método	Ruta	Descripción
GET	/api/reportes	Listar reportes
GET	/api/reportes/:id	Obtener reporte por ID
POST	/api/reportes	Crear reporte
PUT	/api/reportes/:id	Actualizar reporte
PATCH	/api/reportes/:id/estado	Actualizar estado del reporte
DELETE	/api/reportes/:id	Eliminar reporte
POST	/api/reportes/seguimiento/:id	Registrar seguimiento
GET	/api/health	Estado de la API
GET	/api/info	Información del sistema
GET	/api-docs	Swagger/OpenAPI
Ejemplo POST /api/reportes
{
  "titulo": "Fuga de agua en baño",
  "descripcion": "Se detectó una fuga de agua en el lavamanos del baño de estudiantes.",
  "ubicacion": "Bloque A - Planta baja",
  "categoria": "Servicios básicos",
  "estado": "Pendiente",
  "usuarioNombre": "Erick Bravo",
  "usuarioEmail": "erick@upds.edu.bo"
}
Ejemplo PATCH /api/reportes/:id/estado
{
  "estado": "Atendido"
}
Ejemplo POST /api/reportes/seguimiento/:id
{
  "detalle": "Personal de mantenimiento verificó el aula y programó la reparación.",
  "responsable": "Unidad de Mantenimiento"
}
Búsquedas y filtros
GET /api/reportes?q=agua
GET /api/reportes?estado=Pendiente
GET /api/reportes?categoria=Servicios básicos
GET /api/reportes?page=1&limit=10

Estas funcionalidades permiten alcanzar el nivel estratégico definido en la rúbrica oficial mediante búsqueda, filtros y paginación implementados en la API.

Redis Pub/Sub

El sistema utiliza Redis Pub/Sub mediante Upstash Redis para enviar eventos en tiempo real cuando se crean, actualizan o eliminan reportes.

Canales implementados
infra:reportes
infra:notificaciones
Eventos implementados
infra:reporte:creado
infra:reporte:actualizado
infra:reporte:eliminado
infra:reporte:seguimiento_creado
infra:reporte:estado_actualizado
infra:notificacion:mantenimiento
Estructura JSON de eventos
{
  "tipo": "infra:reporte:creado",
  "payload": {
    "id": 1,
    "titulo": "Fuga de agua en baño"
  },
  "timestamp": "2026-05-22T13:03:40.422Z",
  "version": "1.0"
}

La integración Redis + Base de Datos permite que cada operación realizada sobre PostgreSQL dispare automáticamente eventos Pub/Sub, cumpliendo la arquitectura distribuida requerida por la Actividad 3.

Redis Cache

Además del patrón Pub/Sub, Redis también fue utilizado como sistema de caché para optimizar consultas frecuentes del endpoint:

GET /api/reportes
Estrategia implementada
Guardar respuestas GET frecuentes en Redis.
Reutilizar caché cuando la consulta ya existe.
Invalidar automáticamente la caché cuando ocurre POST, PUT, PATCH o DELETE.

Esto reduce consultas repetitivas a PostgreSQL y mejora el rendimiento general de la API.

Socket.IO y tiempo real

Socket.IO fue integrado para mostrar eventos en tiempo real en navegador.

Eventos emitidos
reporte:creado
reporte:actualizado
reporte:eliminado
reporte:seguimiento_creado
reporte:estado_actualizado
Panel tiempo real
GET /
Variables de entorno

Archivo .env

PORT=3000

REDIS_URL=redis://default:"PASSWORD"@"HOST_REDIS":6379

DATABASE_URL=postgresql://postgres:"PASSWORD"@"HOST_SUPABASE":6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres:"PASSWORD"@"HOST_SUPABASE":5432/postgres

Las variables de entorno permiten separar credenciales sensibles del código fuente principal siguiendo las recomendaciones de despliegue cloud.

Instalación local
Instalar dependencias
npm install
Generar Prisma Client
npx prisma generate
Ejecutar migraciones
npx prisma migrate dev
Ejecutar servidor
npm start
Ejecutar subscriber Redis
npm run subscriber
Scripts disponibles
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "subscriber": "node src/redis/redis.subscriber.js",
  "test": "jest --detectOpenHandles --forceExit"
}
Producción
API
https://actividad-1-api-reportes.onrender.com
Swagger
https://actividad-1-api-reportes.onrender.com/api-docs
Panel tiempo real
https://actividad-1-api-reportes.onrender.com

La API fue desplegada en Render configurando variables de entorno y verificando funcionamiento completo de los endpoints en producción.

Persistencia cloud

Inicialmente el sistema utilizaba almacenamiento temporal en memoria mediante arreglos JavaScript.

Posteriormente, durante la Actividad 3, la arquitectura evolucionó hacia persistencia real utilizando Supabase PostgreSQL y Prisma ORM.

Actualmente:

✅ Los datos persisten después de reiniciar el servidor.
✅ CRUD conectado directamente a PostgreSQL cloud.
✅ Relaciones reales entre entidades.
✅ Índices implementados en la base de datos.
✅ Migraciones Prisma funcionando correctamente.

Esto cumple los requisitos de persistencia cloud definidos en la consigna de la Actividad 3.

Validaciones implementadas

✅ Campos obligatorios en POST y PUT
✅ Status codes correctos
✅ Validación de IDs inexistentes
✅ Manejo global de errores
✅ Filtros y búsqueda
✅ Paginación
✅ Eventos Redis estructurados
✅ Persistencia real en Supabase
✅ Comunicación realtime Socket.IO

Pruebas automatizadas

El sistema implementa pruebas automatizadas utilizando Jest y Supertest.

Endpoints validados
GET /api/health
GET /api/info
GET /api/reportes
PATCH /api/reportes/:id/estado
Las pruebas verifican
Integración completa con Express
Persistencia en PostgreSQL
Operaciones Prisma ORM
Endpoints REST
Flujo de actualización de estado
Respuestas HTTP correctas
Ejecución
npm test
Resultado esperado
PASS pruebas/api.prueba.js
4 passed
0 failed

Las pruebas automatizadas permiten validar el funcionamiento básico de la API y garantizan estabilidad en los endpoints principales.

Docker y despliegue cloud

La aplicación fue preparada para futura contenerización mediante Docker, permitiendo despliegue portable en entornos cloud como:

AWS EC2 Free Tier
Render
VPS Linux
Docker Desktop
Próximamente
Dockerfile
docker-compose
despliegue automatizado
integración cloud
Versionado del proyecto

El proyecto fue desarrollado incrementalmente por actividades académicas utilizando versionado evolutivo basado en funcionalidades implementadas.

Actividad 1 — v1.0.0

Implementación inicial de la API REST:

CRUD básico de reportes
Express.js
Swagger/OpenAPI
Arquitectura MVC
Endpoints REST
Variables de entorno
Deploy inicial en Render
Mejoras posteriores
v1.1.0
Búsqueda y filtros
Paginación
Mejoras de validación
v1.2.0
Caché Redis
Invalidación automática
Optimización GET /api/reportes
Actividad 2 — v2.0.0

Integración de comunicación distribuida:

Redis Pub/Sub
Eventos JSON estructurados
Subscriber independiente
Eventos en tiempo real
Mejoras posteriores
v2.1.0
Socket.IO realtime
Panel de notificaciones web
Eventos tipados
Mejoras de sincronización
Actividad 3 — v3.0.0

Persistencia cloud y arquitectura avanzada:

Prisma ORM
Supabase PostgreSQL
Migraciones
Persistencia real cloud
Relaciones entre entidades
Cache distribuido Redis
Endpoint seguimiento
Endpoint PATCH estado
Pruebas automatizadas Jest/Supertest
Mejoras posteriores
v3.1.0
Seguimiento realtime
Actualización de estado realtime
Optimización de pruebas
Mejoras Swagger/OpenAPI
Próxima evolución — Actividad 4 (v4.0.0)

Planificado:

JWT Authentication
Roles y permisos
Middleware de seguridad
CORS avanzado
Protección de endpoints
Validación avanzada
Seguridad API REST
Commits semánticos implementados

Ejemplos de commits utilizados:

feat: crear estructura inicial de la API
feat: agregar swagger a la API
feat: implementar redis pubsub en produccion
feat: agregar socket io para tiempo real
feat: integrar prisma con supabase
feat: agregar endpoints practicos de seguimiento y cambio de estado
docs: actualizar readme con endpoints avanzados y pruebas
fix: corregir configuracion prisma client

El historial Git utiliza commits semánticos siguiendo las recomendaciones de la guía y la rúbrica oficial.

Decisiones técnicas
¿Por qué PostgreSQL y no memoria?

El almacenamiento en memoria pierde información al reiniciar el servidor.

PostgreSQL garantiza persistencia real, relaciones entre tablas y escalabilidad.

¿Por qué Redis además de PostgreSQL?

PostgreSQL almacena los datos persistentes, mientras Redis permite comunicación rápida en tiempo real mediante Pub/Sub sin sobrecargar la base de datos.

¿Por qué Prisma ORM?

Prisma simplifica el acceso a PostgreSQL mediante modelos tipados, migraciones automáticas y relaciones estructuradas.

¿Por qué Socket.IO?

Socket.IO permite actualizar la interfaz web automáticamente sin necesidad de recargar el navegador.

Autor

Erick Bravo Borges
Programación IV
Universidad Privada Domingo Savio
Gestión 2026