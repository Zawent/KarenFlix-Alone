import { getDB } from "../config/db.js";
import { Rol } from "../models/Rol.js";

export async function seedRoles() {
  try {
    const db = getDB();
    const rolesCollection = db.collection("roles");

    const count = await rolesCollection.countDocuments();
    if (count === 0) {
      const rolesDefault = [new Rol("Administrador"), new Rol("Usuario")];
      await rolesCollection.insertMany(rolesDefault);
      console.log("✅ Roles por defecto creados: Administrador, Usuario");
    } else {
      console.log("ℹ️ Roles ya existen, no se insertaron duplicados");
    }
  } catch (err) {
    console.error("❌ Error en seeder de roles:", err);
  }
}
