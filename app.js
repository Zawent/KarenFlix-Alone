import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import rolRoutes from "./src/routes/rolRoutes.js";
import { seedRoles } from "./src/seed/rolSeeder.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Swagger UI docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/roles", rolRoutes);

// Arranque del servidor
async function startServer() {
  try {
    await connectDB();
    await seedRoles(); 

    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar servidor:", err);
  }
}

startServer();
