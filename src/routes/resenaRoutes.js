import express from "express";
import {
  listarPorPelicula,
  listarPorUsuario,
  crearResena,
  editarResena,
  eliminarResena,
  cantidadPorPelicula,
  promedioCalificacion,
  darLike,
  darDislike
} from "../controller/resenaController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reseñas
 *   description: Endpoints para la gestión de reseñas de películas
 */

/**
 * @swagger
 * /resenas/pelicula/{peliculaId}:
 *   get:
 *     summary: Listar reseñas de una película
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: peliculaId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Lista de reseñas de la película
 */
router.get("/pelicula/:peliculaId", listarPorPelicula);

/**
 * @swagger
 * /resenas/usuario/{usuarioId}:
 *   get:
 *     summary: Listar reseñas de un usuario
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reseñas creadas por el usuario
 */
router.get("/usuario/:usuarioId", listarPorUsuario);

/**
 * @swagger
 * /resenas:
 *   post:
 *     summary: Crear una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - peliculaId
 *               - titulo
 *               - comentario
 *               - calificacion
 *             properties:
 *               peliculaId:
 *                 type: string
 *               titulo:
 *                 type: string
 *               comentario:
 *                 type: string
 *               calificacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 */
router.post("/", auth, crearResena);

/**
 * @swagger
 * /resenas/{id}:
 *   put:
 *     summary: Editar una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               comentario:
 *                 type: string
 *               calificacion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reseña actualizada correctamente
 *       403:
 *         description: No autorizado para editar esta reseña
 *       404:
 *         description: Reseña no encontrada
 */
router.put("/:id", auth, editarResena);

/**
 * @swagger
 * /resenas/{id}:
 *   delete:
 *     summary: Eliminar una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña a eliminar
 *     responses:
 *       200:
 *         description: Reseña eliminada correctamente
 *       403:
 *         description: No autorizado para eliminar esta reseña
 *       404:
 *         description: Reseña no encontrada
 */
router.delete("/:id", auth, eliminarResena);

/**
 * @swagger
 * /resenas/cantidad/{peliculaId}:
 *   get:
 *     summary: Obtener cantidad de reseñas de una película
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: peliculaId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Cantidad de reseñas de la película
 */
router.get("/cantidad/:peliculaId", cantidadPorPelicula);

/**
 * @swagger
 * /resenas/promedio/{peliculaId}:
 *   get:
 *     summary: Obtener promedio de calificación de una película
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: peliculaId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Promedio de calificación de la película
 */
router.get("/promedio/:peliculaId", promedioCalificacion);

/**
 * @swagger
 * /resenas/{id}/like:
 *   post:
 *     summary: Dar like a una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Like agregado correctamente
 */
router.post("/:id/like", auth, darLike);

/**
 * @swagger
 * /resenas/{id}/dislike:
 *   post:
 *     summary: Dar dislike a una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Dislike agregado correctamente
 */
router.post("/:id/dislike", auth, darDislike);

export default router;
