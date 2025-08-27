import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export async function listarRoles(req, res) {
  try {
    const db = getDB();
    const roles = await db.collection("roles").find().toArray();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener roles" });
  }
}

export async function buscarRolPorId(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    const rol = await db.collection("roles").findOne({ _id: new ObjectId(id) });
    if (!rol) return res.status(404).json({ error: "Rol no encontrado" });

    res.json(rol);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar el rol" });
  }
}
