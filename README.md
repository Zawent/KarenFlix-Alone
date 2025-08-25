📌 Tareas divididas por Backend y Frontend
🔹 Backend (Node.js + Express + MongoDB)

Configuración inicial del proyecto (Express, dotenv, swagger-ui-express, cors).

Configuración de MongoDB y conexión.

Implementar seguridad: JWT (passport-jwt, bcrypt), express-rate-limit.

Arquitectura modular (/models, /controllers, /routes, /middlewares, /services, /config, /utils).

Endpoints para:

Auth (registro, login).

CRUD usuarios (roles).

CRUD películas/series.

CRUD reseñas (con transacciones).

Likes/Dislikes.

CRUD categorías.

Ranking y filtros.

Validaciones con express-validator.

Documentación con Swagger.

Manejo de errores centralizado.

🔹 Frontend (REACT)

Estructura base: index.html + CSS global + JS modular.

Pantallas:

Inicio (listado de películas).

Registro/Login (formularios con validaciones).

Detalle de película (info + reseñas).

Panel admin (gestión de categorías y películas).

Consumo de API con fetch().

Manejo de tokens JWT en localStorage.

Mostrar mensajes de validación/error.

Estilos responsive con CSS.