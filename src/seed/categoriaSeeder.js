import { getDB } from "../config/db.js";
import { Categoria } from "../models/Categoria.js";

export async function seedCategorias() {
    try {
        const db = getDB();
        const categoriasCollection = db.collection("categorias");

        const count = await categoriasCollection.countDocuments();
        if (count === 0) {
            const categoriasDefault = [
                new Categoria({ nombre: "Acción", descripcion: "Películas y series con mucha adrenalina y escenas de combate" }),
                new Categoria({ nombre: "Comedia", descripcion: "Series y películas para reír y disfrutar momentos divertidos" }),
                new Categoria({ nombre: "Drama", descripcion: "Historias intensas y emocionales con gran carga narrativa" }),
                new Categoria({ nombre: "Ciencia Ficción", descripcion: "Producciones con viajes espaciales, futuros distópicos y tecnología avanzada" }),
                new Categoria({ nombre: "Fantasía", descripcion: "Mundos mágicos, criaturas épicas y aventuras extraordinarias" }),
                new Categoria({ nombre: "Terror", descripcion: "Películas y series que provocan miedo, suspenso o tensión" }),
                new Categoria({ nombre: "Documental", descripcion: "Producciones basadas en hechos reales y educativas" }),
                new Categoria({ nombre: "Animación", descripcion: "Películas y series animadas para todas las edades" }),
            ];
            await categoriasCollection.insertMany(categoriasDefault);
            console.log("✅ Categorías por defecto creadas");
        } else {
            console.log("ℹ️ Categorías ya existen, no se insertaron duplicados");
        }
    } catch (err) {
        console.error("❌ Error en seeder de categorías:", err);
    }
}
