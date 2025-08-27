import { Router } from "express";
import { listarRoles, buscarRolPorId } from "../controller/rolController.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Endpoints para gestionar roles
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Listar todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 */
router.get("/", listarRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Buscar un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *       404:
 *         description: Rol no encontrado
 */
router.get("/:id", auth, buscarRolPorId);

export default router;
