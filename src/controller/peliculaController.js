import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { Pelicula } from "../models/Pelicula.js";

// Crear película/serie
export const crearPelicula = async (req, res) => {
  try {
    const { titulo, descripcion, categoriaId, anio, imagen, tipo } = req.body;

    // Definir aprobación según el rol
    const aprobada = req.usuario.rol === "Administrador";

    const pelicula = new Pelicula(
      titulo,
      descripcion,
      new ObjectId(categoriaId),
      anio,
      imagen,
      tipo,
      aprobada
    );

    const db = getDB();
    const result = await db.collection("peliculas").insertOne(pelicula);

    res.status(201).json({ msg: "Película/Serie creada", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la película/serie", error });
  }
};

// Listar todas
export const listarPeliculas = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db.collection("peliculas").find().toArray();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar películas/series", error });
  }
};

// Listar por ID
export const listarPorId = async (req, res) => {
  try {
    const db = getDB();
    const pelicula = await db.collection("peliculas").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!pelicula) return res.status(404).json({ msg: "Película/Serie no encontrada" });
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener película/serie", error });
  }
};

// Listar por categoría
export const listarPorCategoria = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db
      .collection("peliculas")
      .find({ categoriaId: new ObjectId(req.params.categoriaId) })
      .toArray();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ msg: "Error al filtrar por categoría", error });
  }
};

// Listar por tipo (pelicula o serie)
export const listarPorTipo = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db
      .collection("peliculas")
      .find({ tipo: req.params.tipo })
      .toArray();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ msg: "Error al filtrar por tipo", error });
  }
};

// Editar (solo administrador)
export const editarPelicula = async (req, res) => {
  try {
    const { titulo, descripcion, categoriaId, anio, imagen, tipo } = req.body;
    const db = getDB();

    const result = await db.collection("peliculas").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          titulo,
          descripcion,
          categoriaId: new ObjectId(categoriaId),
          anio,
          imagen,
          tipo,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: "Película/Serie no encontrada" });
    }

    res.json({ msg: "Película/Serie actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al editar película/serie", error });
  }
};

// Eliminar (solo administrador)
export const eliminarPelicula = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("peliculas").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Película/Serie no encontrada" });
    }

    res.json({ msg: "Película/Serie eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar película/serie", error });
  }
};

// Cambiar estado de aprobación (solo admin)
export const cambiarEstadoAprobacion = async (req, res) => {
  try {
    const db = getDB();
    const { aprobada } = req.body;

    const result = await db.collection("peliculas").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { aprobada } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: "Película/Serie no encontrada" });
    }

    res.json({ msg: `Estado de aprobación actualizado a ${aprobada}` });
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar estado de aprobación", error });
  }
};
