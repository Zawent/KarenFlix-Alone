import { Router } from "express";
import {
  listarCategorias,
  buscarCategoriaPorId,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
  buscarCategoriaPorNombre,
} from "../controller/categoriaController.js";
import { auth, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints para gestionar categorías de películas/series
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 */
router.get("/", listarCategorias);

/**
 * @swagger
 * /categorias/buscar:
 *   get:
 *     summary: Buscar categoría por nombre
 *     tags: [Categorías]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/buscar", buscarCategoriaPorNombre);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Buscar una categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", buscarCategoriaPorId);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear una nueva categoría (solo admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *       400:
 *         description: La categoría ya existe
 */
router.post("/", auth, authorizeRoles(["Administrador"]), crearCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Editar una categoría (solo admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/:id", auth, authorizeRoles(["Administrador"]), editarCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría (solo admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", auth, authorizeRoles(["Administrador"]), eliminarCategoria);

export default router;
