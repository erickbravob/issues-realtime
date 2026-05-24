# API REST — Sistema de Reportes de Infraestructura Universitaria

Proyecto desarrollado para la materia **Programación IV** de la **Universidad Privada Domingo Savio (UPDS)**.

El sistema implementa una arquitectura distribuida basada en API REST, PostgreSQL en la nube, Redis Pub/Sub y notificaciones en tiempo real mediante Socket.IO, tomando como referencia la arquitectura propuesta en el texto guía de StudySync adaptada al proyecto final de infraestructura universitaria. :contentReference[oaicite:0]{index=0}

---

# Descripción

El sistema permite registrar, consultar, actualizar y eliminar reportes relacionados con problemas de infraestructura universitaria, tales como:

- luminarias dañadas,
- fugas de agua,
- cableado defectuoso,
- problemas eléctricos,
- daños en aulas,
- mantenimiento institucional.

Además, el sistema implementa comunicación en tiempo real utilizando Redis Pub/Sub y Socket.IO, permitiendo que los eventos generados por la API sean enviados automáticamente a clientes conectados desde navegador.

---

# Tecnologías utilizadas

| Tecnología | Uso en el sistema |
|------------|-------------------|
| Node.js + Express | API REST y servidor backend |
| Prisma ORM | Acceso y modelado de base de datos |
| Supabase PostgreSQL | Persistencia cloud de datos |
| Upstash Redis | Redis Pub/Sub distribuido |
| Socket.IO | Comunicación en tiempo real |
| Swagger/OpenAPI | Documentación interactiva |
| dotenv | Variables de entorno |
| Git y GitHub | Control de versiones |
| Render | Despliegue en producción |

---

# Arquitectura del sistema

```text
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

Estructura del proyecto:

ACTIVIDAD_1/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
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

Endpoints principales
Método	Ruta	Descripción
GET	/api/reportes	Listar reportes
GET	/api/reportes/:id	Obtener reporte por ID
POST	/api/reportes	Crear reporte
PUT	/api/reportes/:id	Actualizar reporte
DELETE	/api/reportes/:id	Eliminar reporte
GET	/api/health	Estado de la API
GET	/api/info	Información del sistema
GET	/api-docs	Swagger/OpenAPI

La estructura CRUD implementada sigue la consigna oficial de Programación IV utilizando los verbos HTTP correctos y manejo de errores mediante códigos 200, 201, 400 y 404.

Ejemplo POST /api/reportes:

{
  "titulo": "Fuga de agua en baño",
  "descripcion": "Se detectó una fuga de agua en el lavamanos del baño de estudiantes.",
  "ubicacion": "Bloque A - Planta baja",
  "categoria": "Servicios básicos",
  "estado": "Pendiente",
  "usuarioNombre": "Erick Bravo",
  "usuarioEmail": "erick@upds.edu.bo"
}

Búsqueda: GET /api/reportes?q=agua
Filtro por estado: GET /api/reportes?estado=Pendiente
Filtro por categoría: GET /api/reportes?categoria=Servicios básicos
Paginación: GET /api/reportes?page=1&limit=10

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

Socket.IO y tiempo real

Socket.IO fue integrado para mostrar eventos en tiempo real en el navegador.

Eventos emitidos:

reporte:creado
reporte:actualizado
reporte:eliminado

Panel tiempo real:

GET /
Variables de entorno

Archivo .env:

PORT=3000

REDIS_URL=redis://default:"Pass"@TU_HOST_REDIS:6379

DATABASE_URL=postgresql://postgres:"Pass"@TU_HOST_SUPABASE:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres:"Pass"@TU_HOST_SUPABASE:5432/postgres

Las variables de entorno permiten separar credenciales sensibles del código fuente principal siguiendo las recomendaciones de la guía y las buenas prácticas de despliegue cloud.

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
  "subscriber": "node src/redis/redis.subscriber.js"
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

Inicialmente el sistema utilizaba almacenamiento temporal en memoria mediante arreglos JavaScript. Posteriormente, durante la Actividad 3, la arquitectura evolucionó hacia persistencia real utilizando Supabase PostgreSQL y Prisma ORM.

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

Commits semánticos implementados

Ejemplos de commits utilizados:

feat: crear estructura inicial de la API
feat: agregar swagger a la API
feat: implementar redis pubsub en produccion
feat: agregar socket io para tiempo real
feat: integrar prisma con supabase
docs: actualizar readme con supabase redis y socket io
fix: corregir configuracion prisma client

El historial Git utiliza commits semánticos siguiendo las recomendaciones de la guía y la rúbrica oficial.

Decisiones técnicas
¿Por qué PostgreSQL y no memoria?

El almacenamiento en memoria pierde información al reiniciar el servidor. PostgreSQL garantiza persistencia real, relaciones entre tablas y escalabilidad.

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