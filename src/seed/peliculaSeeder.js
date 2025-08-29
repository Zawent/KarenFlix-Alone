// src/seed/peliculaSeeder.js
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import { Pelicula } from "../models/Pelicula.js";

export async function seedPeliculas() {
  try {
    const db = getDB();
    const peliculasCollection = db.collection("peliculas");

    // Índice único por título para evitar duplicados
    await peliculasCollection.createIndex({ titulo: 1 }, { unique: true });

    // Datos por defecto (la propiedad "categoria" es el nombre de la categoría existente)
    const peliculasDefault = [
      {
        titulo: "Matrix",
        descripcion: "Un hacker descubre la verdad sobre su mundo.",
        categoria: "Ciencia Ficción",
        anio: 1999,
        imagen: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
      {
        titulo: "Stranger Things",
        descripcion: "Niños se enfrentan a fenómenos sobrenaturales en su pueblo.",
        categoria: "Ciencia Ficción",
        anio: 2016,
        imagen: "https://example.com/stranger-things.jpg",
        tipo: "serie",
        aprobada: true,
      },
      {
        titulo: "El Señor de los Anillos: La Comunidad del Anillo",
        descripcion: "Un hobbit emprende un viaje para destruir un anillo poderoso.",
        categoria: "Fantasía",
        anio: 2001,
        imagen: "https://example.com/lotr1.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
      {
        titulo: "Shrek",
        descripcion: "Un ogro poco convencional se embarca en una misión para rescatar a una princesa.",
        categoria: "Animación",
        anio: 2001,
        imagen: "https://example.com/shrek.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
      {
        titulo: "El Conjuro",
        descripcion: "Investigadores paranormales ayudan a una familia aterrorizada por una presencia oscura.",
        categoria: "Terror",
        anio: 2013,
        imagen: "https://example.com/the-conjuring.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
      {
        titulo: "Parásitos",
        descripcion: "Una familia humilde se infiltra en la vida de una familia rica con consecuencias inesperadas.",
        categoria: "Drama",
        anio: 2019,
        imagen: "https://example.com/parasite.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
      {
        titulo: "Toy Story",
        descripcion: "Los juguetes cobran vida cuando los humanos no están presentes.",
        categoria: "Animación",
        anio: 1995,
        imagen: "https://example.com/toy-story.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
      {
        titulo: "Superbad",
        descripcion: "Comedia sobre dos amigos en la secundaria tratando de ir a una fiesta inolvidable.",
        categoria: "Comedia",
        anio: 2007,
        imagen: "https://example.com/superbad.jpg",
        tipo: "pelicula",
        aprobada: true,
      },
    ];

    const ops = [];

    for (const p of peliculasDefault) {
      // Buscar la categoría por nombre
      const categoriaDoc = await db.collection("categorias").findOne({ nombre: p.categoria });

      if (!categoriaDoc) {
        console.warn(`⚠️ Categoría '${p.categoria}' no encontrada. Se omite la película '${p.titulo}'.`);
        continue; // saltar si la categoría no existe
      }

      // Crear objeto Pelicula usando tu clase (respetando constructor)
      const peliculaObj = new Pelicula(
        p.titulo,
        p.descripcion,
        categoriaDoc._id, // ObjectId
        p.anio,
        p.imagen,
        p.tipo,
        p.aprobada === true // booleano
      );

      // Upsert: si ya existe por título, no lo duplicamos
      ops.push({
        updateOne: {
          filter: { titulo: peliculaObj.titulo },
          update: { $setOnInsert: peliculaObj },
          upsert: true,
        },
      });
    }

    if (ops.length > 0) {
      const result = await peliculasCollection.bulkWrite(ops);
      console.log("✅ Seed películas ejecutado. Resultado:", {
        inserted: result.upsertedCount,
        matched: result.matchedCount,
      });
    } else {
      console.log("ℹ️ No se ejecutaron inserciones (no se encontraron categorías o no había películas válidas).");
    }
  } catch (err) {
    console.error("❌ Error en seeder de películas:", err);
  }
}
