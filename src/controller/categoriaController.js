import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { Categoria } from "../models/Categoria.js";

// Listar todas las categorías
export const listarCategorias = async (req, res) => {
  try {
    const db = getDB();
    const categorias = await db.collection("categorias").find().toArray();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener las categorías", error });
  }
};

// Buscar categoría por ID
export const buscarCategoriaPorId = async (req, res) => {
  try {
    const db = getDB();
    const categoria = await db
      .collection("categorias")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar la categoría", error });
  }
};

// Crear nueva categoría (solo admin)
export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const db = getDB();

    // Validar duplicados
    const existente = await db.collection("categorias").findOne({ nombre });
    if (existente) {
      return res.status(400).json({ msg: "La categoría ya existe" });
    }

    const nuevaCategoria = new Categoria({ nombre, descripcion });
    const result = await db.collection("categorias").insertOne(nuevaCategoria);

    res.status(201).json({ msg: "Categoría creada con éxito", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear categoría", error });
  }
};

// Editar categoría (solo admin)
export const editarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const db = getDB();

    const result = await db.collection("categorias").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { nombre, descripcion } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.json({ msg: "Categoría actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar categoría", error });
  }
};

// Eliminar categoría (solo admin)
export const eliminarCategoria = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("categorias").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.json({ msg: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar categoría", error });
  }
};

// Buscar por nombre
export const buscarCategoriaPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    const db = getDB();

    const categoria = await db.collection("categorias").findOne({ nombre });

    if (!categoria) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar categoría por nombre", error });
  }
};
