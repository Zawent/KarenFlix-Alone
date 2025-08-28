// seedAdmin.js
import bcrypt from "bcrypt"; // 👈 aquí usamos bcrypt en lugar de bcryptjs
import { getDB, connectDB } from "../config/db.js";
import { Usuario } from "../models/Usuario.js";

async function seedAdmin() {
  try {
    // Conexión a la base de datos
    await connectDB();
    const db = getDB();

    // Buscar rol Administrador
    const rolDoc = await db.collection("roles").findOne({ nombre: "Administrador" });
    if (!rolDoc) {
      console.error("❌ Rol 'Administrador' no encontrado en la colección roles.");
      process.exit(1);
    }

    // Verificar si ya existe usuario admin
    const existing = await db.collection("usuarios").findOne({ email: "admin@admin.com" });
    if (existing) {
      console.log("⚠️ El usuario administrador ya existe.");
      process.exit(0);
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("admin123", salt);

    // Crear objeto usuario
    const usuarioObj = new Usuario({
      nombre: "Admin",
      email: "admin@admin.com",
      password: hashed,
      fechaNacimiento: new Date("1990-01-01"), // puedes cambiar la fecha
      rolId: rolDoc._id,
    });

    // Insertar en la colección
    const result = await db.collection("usuarios").insertOne(usuarioObj);
    console.log("✅ Usuario administrador creado con ID:", result.insertedId);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error al crear usuario administrador:", err);
    process.exit(1);
  }
}

seedAdmin();
