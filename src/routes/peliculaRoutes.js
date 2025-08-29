// routes/peliculaRoutes.js
import express from "express";
import {
  crearPelicula,
  listarPeliculas,
  listarPorId,
  listarPorCategoria,
  listarPorTipo,
  editarPelicula,
  eliminarPelicula,
  cambiarEstadoAprobacion,
} from "../controller/peliculaController.js";
import { auth, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Peliculas
 *   description: Endpoints para gestionar películas
 */

/**
 * @swagger
 * /peliculas:
 *   post:
 *     summary: Crear una nueva película
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *               tipo:
 *                 type: string
 *               aprobado:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 */
router.post("/", auth, crearPelicula);

/**
 * @swagger
 * /peliculas:
 *   get:
 *     summary: Listar todas las películas
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de películas obtenida exitosamente
 */
router.get("/", auth, listarPeliculas);

/**
 * @swagger
 * /peliculas/{id}:
 *   get:
 *     summary: Buscar película por ID
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Película encontrada
 *       404:
 *         description: Película no encontrada
 */
router.get("/:id", auth, listarPorId);

/**
 * @swagger
 * /peliculas/categoria/{categoriaId}:
 *   get:
 *     summary: Listar películas por categoría
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoriaId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Lista de películas de la categoría
 */
router.get("/categoria/:categoriaId", auth, listarPorCategoria);

/**
 * @swagger
 * /peliculas/tipo/{tipo}:
 *   get:
 *     summary: Listar películas por tipo
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         schema:
 *           type: string
 *         required: true
 *         description: "Tipo de película (ej: serie, documental, etc.)"
 *     responses:
 *       200:
 *         description: Lista de películas por tipo
 */
router.get("/tipo/:tipo", auth, listarPorTipo);

/**
 * @swagger
 * /peliculas/{id}:
 *   put:
 *     summary: Editar película (solo Administrador)
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *               tipo:
 *                 type: string
 *               aprobado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Película editada exitosamente
 *       403:
 *         description: No autorizado
 */
router.put("/:id", auth, authorizeRoles(["Administrador"]), editarPelicula);

/**
 * @swagger
 * /peliculas/{id}:
 *   delete:
 *     summary: Eliminar película (solo Administrador)
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Película eliminada exitosamente
 *       403:
 *         description: No autorizado
 */
router.delete("/:id", auth, authorizeRoles(["Administrador"]), eliminarPelicula);

/**
 * @swagger
 * /peliculas/aprobar/{id}:
 *   patch:
 *     summary: Cambiar estado de aprobación de una película (solo Administrador)
 *     tags: [Peliculas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Estado de aprobación actualizado
 *       403:
 *         description: No autorizado
 */
router.patch(
  "/aprobar/:id",
  auth,
  authorizeRoles(["Administrador"]),
  cambiarEstadoAprobacion
);

export default router;
