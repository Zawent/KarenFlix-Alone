import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import rolRoutes from "./src/routes/rolRoutes.js";
import { seedRoles } from "./src/seed/rolSeeder.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";
import rateLimit from "express-rate-limit";

// Limiter global máximo 100 requests cada 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Máximo 100 requests por IP
  message: { msg: "Demasiadas peticiones, intenta de nuevo más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(limiter);

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
