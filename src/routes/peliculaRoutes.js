import express from "express";
import {
  crearPelicula,
  listarPeliculas,
  listarPendientesUsuario,
  listarPorCategoria,
  listarPorTipo,
  listarPorId,
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

// Crear
router.post("/", auth, crearPelicula);

// Listar todas
router.get("/", auth, listarPeliculas);

// Listar pendientes del usuario autenticado
router.get("/pendientes", auth, listarPendientesUsuario);

// Listar por categoría
router.get("/categoria/:categoriaId", auth, listarPorCategoria);

// Listar por tipo
router.get("/tipo/:tipo", auth, listarPorTipo);

// Listar por ID (debe ir después de las rutas estáticas para evitar conflictos)
router.get("/:id", auth, listarPorId);

// Editar (solo administrador)
router.put("/:id", auth, authorizeRoles(["Administrador"]), editarPelicula);

// Eliminar (solo administrador)
router.delete("/:id", auth, authorizeRoles(["Administrador"]), eliminarPelicula);

// Cambiar estado de aprobación (solo administrador)
router.patch(
  "/aprobar/:id",
  auth,
  authorizeRoles(["Administrador"]),
  cambiarEstadoAprobacion
);

export default router;
