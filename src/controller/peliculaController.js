import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { Pelicula } from "../models/Pelicula.js";
import path from "path";
import fs from "fs";


// Crear película/serie
export const crearPelicula = async (req, res) => {
  try {
    const { titulo, descripcion, categoriaId, anio, imagen, tipo } = req.body;

    if (!ObjectId.isValid(categoriaId)) {
      return res.status(400).json({ msg: "El ID de la categoría no es válido" });
    }

    const db = getDB();

    // Verificar que la categoría exista
    const categoria = await db
      .collection("categorias")
      .findOne({ _id: new ObjectId(categoriaId) });

    if (!categoria) {
      return res.status(400).json({ msg: "La categoría especificada no existe" });
    }

    const aprobada = req.usuario.rol === "Administrador";
    const userId = req.usuario.id;

    const pelicula = new Pelicula(
      titulo,
      descripcion,
      new ObjectId(categoriaId),
      anio,
      imagen,
      tipo,
      aprobada,
      new ObjectId(userId)
    );

    const result = await db.collection("peliculas").insertOne(pelicula);

    res.status(201).json({ msg: "Película/Serie creada", id: result.insertedId });
  } catch (error) {
    console.error("Error al crear la película:", error);
    res.status(500).json({ msg: "Error al crear la película/serie", error: error.message });
  }
};

// Listar todas
export const listarPeliculas = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db.collection("peliculas").find({
      aprobada: true
    }).toArray();

    res.json(peliculas);
  } catch (error) {
    console.error("Error al listar películas:", error);
    res.status(500).json({ msg: "Error al listar películas" });
  }
};


// Listar pendientes del usuario autenticado
export const listarPendientesUsuario = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.usuario.id || req.usuario._id;

    const peliculas = await db.collection("peliculas").find({
      aprobada: false,
      userId: new ObjectId(userId),
    }).toArray();

    res.json(peliculas);
  } catch (error) {
    console.error("Error al listar películas pendientes:", error);
    res.status(500).json({ msg: "Error al listar películas pendientes" });
  }
};

// Listar por categoría
export const listarPorCategoria = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db.collection("peliculas")
      .find({ categoriaId: new ObjectId(req.params.categoriaId) })
      .toArray();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ msg: "Error al filtrar por categoría", error });
  }
};

// Listar por tipo (película o serie)
export const listarPorTipo = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db.collection("peliculas")
      .find({ tipo: req.params.tipo })
      .toArray();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ msg: "Error al filtrar por tipo", error });
  }
};

// Listar por ID
export const listarPorId = async (req, res) => {
  try {
    const db = getDB();
    const pelicula = await db.collection("peliculas").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!pelicula) {
      return res.status(404).json({ msg: "Película/Serie no encontrada" });
    }
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener película/serie", error });
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


// Exportar todas las películas a un archivo CSV
export const exportarPeliculasCSV = async (req, res) => {
  try {
    const db = getDB();
    const peliculas = await db.collection("peliculas").find().toArray();

    if (peliculas.length === 0) {
      return res.status(400).json({ msg: "No hay películas para exportar" });
    }

    // Ruta donde se guardará el archivo CSV
    const exportPath = path.join(__dirname, "../exports/peliculas.csv");

    // Encabezado del archivo CSV
    const header = "Título,Descripción,Categoría ID,Año,Imagen,Tipo,Aprobada,User ID\n";

    // Crear contenido del archivo CSV
    const content = peliculas.map(pelicula => {
      return `"${pelicula.titulo}","${pelicula.descripcion}","${pelicula.categoriaId}","${pelicula.anio}","${pelicula.imagen}","${pelicula.tipo}","${pelicula.aprobada}","${pelicula.userId}"`;
    }).join("\n");

    // Verificar si la carpeta 'exports' existe, si no, crearla
    const exportFolderPath = path.join(__dirname, "../exports");
    if (!fs.existsSync(exportFolderPath)) {
      fs.mkdirSync(exportFolderPath);
    }

    // Escribir el archivo CSV
    const csvData = header + content;
    fs.writeFileSync(exportPath, csvData);

    res.status(200).json({
      msg: "Películas exportadas exitosamente",
      file: exportPath,
    });
  } catch (error) {
    console.error("Error al exportar las películas a CSV:", error);
    res.status(500).json({ msg: "Error al exportar películas a CSV", error: error.message });
  }
};
