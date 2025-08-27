// src/controllers/usuarioController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { Usuario } from "../models/Usuario.js";

/** Helper: quitar campos sensibles antes de responder */
function sanitize(user) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

/**
 * Registro de usuario con rol "usuario"
 */
export async function registerUsuario(req, res) {
  try {
    const db = getDB();
    const { nombre, email, password, fechaNacimiento } = req.body;

    const existing = await db.collection("usuarios").findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: "El email ya está registrado." });

    const rolDoc = await db.collection("roles").findOne({ nombre: "Usuario" });
    if (!rolDoc) return res.status(500).json({ msg: "Rol 'Usuario' no encontrado" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const usuarioObj = new Usuario({
      nombre,
      email: email.toLowerCase(),
      password: hashed,
      fechaNacimiento,
      rolId: rolDoc._id,
    });

    const result = await db.collection("usuarios").insertOne(usuarioObj);
    const created = await db.collection("usuarios").findOne({ _id: result.insertedId });

    res.status(201).json(sanitize(created));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
}

/**
 * Registro de administrador
 */
export async function registerAdmin(req, res) {
  try {
    const db = getDB();
    const { nombre, email, password, fechaNacimiento } = req.body;

    const existing = await db.collection("usuarios").findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ msg: "El email ya está registrado." });

    const rolDoc = await db.collection("roles").findOne({ nombre: "Administrador" });
    if (!rolDoc) return res.status(500).json({ msg: "Rol 'Administrador' no encontrado" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const usuarioObj = new Usuario({
      nombre,
      email: email.toLowerCase(),
      password: hashed,
      fechaNacimiento,
      rolId: rolDoc._id,
    });

    const result = await db.collection("usuarios").insertOne(usuarioObj);
    const created = await db.collection("usuarios").findOne({ _id: result.insertedId });

    res.status(201).json(sanitize(created));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al registrar administrador" });
  }
}

/**
 * Login de usuario
 */
export async function loginUser(req, res) {
  try {
    const db = getDB();
    const { email, password } = req.body;

    const user = await db.collection("usuarios").findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Credenciales inválidas" });

    const rolDoc = await db.collection("roles").findOne({ _id: user.rolId });
    const rolNombre = rolDoc ? rolDoc.nombre : null;

    const payload = { id: user._id.toString(), rol: rolNombre };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, usuario: sanitize(user), rol: rolNombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en login" });
  }
}

/**
 * Listar todos los usuarios (solo admin)
 */
export async function obtenerUsuarios(req, res) {
  try {
    const db = getDB();

    const pipeline = [
      { $lookup: { from: "roles", localField: "rolId", foreignField: "_id", as: "rol" } },
      { $unwind: "$rol" },
      { $project: { password: 0 } },
    ];

    const usuarios = await db.collection("usuarios").aggregate(pipeline).toArray();
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
}

/**
 * Listar usuario por ID (admin o el mismo usuario)
 */
export async function obtenerUsuarioPorId(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    const usuario = await db.collection("usuarios").findOne({ _id: new ObjectId(id) });
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    res.json(sanitize(usuario));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener usuario" });
  }
}

/**
 * Listar usuarios por rol
 */
export async function obtenerUsuariosPorRol(req, res) {
  try {
    const db = getDB();
    const { rolNombre } = req.params;

    const rolDoc = await db.collection("roles").findOne({ nombre: rolNombre });
    if (!rolDoc) return res.status(404).json({ msg: "Rol no encontrado" });

    const usuarios = await db.collection("usuarios").find({ rolId: rolDoc._id }).project({ password: 0 }).toArray();
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener usuarios por rol" });
  }
}

/**
 * Actualizar usuario (dueño o admin).
 * No puede cambiar correo ni rol aquí.
 */
export async function actualizarUsuario(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    const { nombre, password, fechaNacimiento } = req.body;
    const updates = {};
    if (nombre) updates.nombre = nombre;
    if (fechaNacimiento) updates.fechaNacimiento = fechaNacimiento;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    await db.collection("usuarios").updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const actualizado = await db.collection("usuarios").findOne({ _id: new ObjectId(id) });

    res.json(sanitize(actualizado));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
}

/**
 * Eliminar usuario (soft delete con estado=false).
 * Dueño o admin.
 */
export async function eliminarUsuario(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    await db.collection("usuarios").updateOne({ _id: new ObjectId(id) }, { $set: { estado: false } });
    res.json({ msg: "Usuario eliminado (estado=false)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
}

/**
 * Cambiar rol de usuario (solo admin)
 */
export async function cambiarRolUsuario(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const { nuevoRol } = req.body;

    if (req.usuario.rol !== "admin") return res.status(403).json({ msg: "Solo admin puede cambiar roles" });
    if (!ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    const rolDoc = await db.collection("roles").findOne({ nombre: nuevoRol });
    if (!rolDoc) return res.status(404).json({ msg: "Rol no encontrado" });

    await db.collection("usuarios").updateOne({ _id: new ObjectId(id) }, { $set: { rolId: rolDoc._id } });
    res.json({ msg: `Rol cambiado a ${nuevoRol}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al cambiar rol de usuario" });
  }
}
