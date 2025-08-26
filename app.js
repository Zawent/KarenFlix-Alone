import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Bienvenido a KarenFlix API 🚀" });
});

async function startServer() {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ No se pudo iniciar el servidor:", err);
  }
}

startServer();
