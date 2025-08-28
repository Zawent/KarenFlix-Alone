// src/routes/usuarioRoutes.js
import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import {
  registerUsuario,
  registerAdmin,
  loginUser,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuariosPorRol,
  actualizarUsuario,
  eliminarUsuario,
  cambiarRolUsuario,
} from "../controller/usuarioController.js"; // si usas "controllers", ajusta la ruta
import { auth, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// helper para recoger errores de express-validator
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios (registro, login, CRUD)
 */

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registro público de usuario (rol "usuario")
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos / email en uso
 */
router.post(
  "/register",
  [
    body("nombre").notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("fechaNacimiento").optional().isISO8601().withMessage("Fecha inválida"),
  ],
  runValidation,
  registerUsuario
);

/**
 * @swagger
 * /usuarios/register-admin:
 *   post:
 *     summary: Registro de administrador (solo accesible por admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Admin creado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post(
  "/register-admin",
  auth,
  authorizeRoles(["admin"]),
  [
    body("nombre").notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("fechaNacimiento").optional().isISO8601().withMessage("Fecha inválida"),
  ],
  runValidation,
  registerAdmin
);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Login (genera JWT)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso (devuelve token)
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Password requerido"),
  ],
  runValidation,
  loginUser
);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios (sin passwords)
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get("/", auth, authorizeRoles(["admin"]), obtenerUsuarios);

/**
 * @swagger
 * /usuarios/rol/{rolNombre}:
 *   get:
 *     summary: Listar usuarios por rol (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: rolNombre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nombre del rol (ej: admin, usuario)"
 *     responses:
 *       200:
 *         description: Usuarios filtrados por rol
 *       404:
 *         description: Rol no encontrado
 */
router.get(
  "/rol/:rolNombre",
  auth,
  authorizeRoles(["admin"]),
  [param("rolNombre").notEmpty().withMessage("rolNombre requerido")],
  runValidation,
  obtenerUsuariosPorRol
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID (admin o el mismo usuario)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado (sin password)
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  "/:id",
  auth,
  [param("id").isMongoId().withMessage("ID inválido")],
  runValidation,
  obtenerUsuarioPorId
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario (dueño o admin). No se puede cambiar email ni rol.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Usuario actualizado (sin password)
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
router.put(
  "/:id",
  auth,
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("nombre").optional().isString().withMessage("Nombre inválido"),
    body("password").optional().isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("fechaNacimiento").optional().isISO8601().withMessage("Fecha inválida"),
    // no validar email/rol aquí porque no deben enviarse (si llegan serán ignorados por controller)
  ],
  runValidation,
  actualizarUsuario
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (soft delete). Puede borrar el dueño o admin.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado (estado=false)
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  "/:id",
  auth,
  [param("id").isMongoId().withMessage("ID inválido")],
  runValidation,
  eliminarUsuario
);

/**
 * @swagger
 * /usuarios/{id}/rol:
 *   put:
 *     summary: Cambiar rol de un usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que se cambiará el rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nuevoRol]
 *             properties:
 *               nuevoRol:
 *                 type: string
 *                 description: "Nombre del rol de destino (ej: admin, usuario)"
 *     responses:
 *       200:
 *         description: Rol cambiado correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
router.put(
  "/:id/rol",
  auth,
  authorizeRoles(["admin"]),
  [
    param("id").isMongoId().withMessage("ID inválido"),
    body("nuevoRol").notEmpty().withMessage("nuevoRol es requerido"),
  ],
  runValidation,
  cambiarRolUsuario
);

export default router;
