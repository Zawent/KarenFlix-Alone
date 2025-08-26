import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let db;

export async function connectDB() {
  if (db) return db; 

  try {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME); 
    console.log("✅ Conectado a MongoDB:", process.env.DB_NAME);
    return db;
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("⚠️ No hay conexión activa con MongoDB");
  }
  return db;
}
