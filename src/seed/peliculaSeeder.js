// src/seed/peliculaSeeder.js
import { getDB } from "../config/db.js";
import { Pelicula } from "../models/Pelicula.js";

export async function seedPeliculas() {
  try {
    const db = getDB();
    const peliculasCollection = db.collection("peliculas");

    // Índice único por título
    await peliculasCollection.createIndex({ titulo: 1 }, { unique: true });

    // 👇 Lista de películas sacadas de tu movies.html
    const peliculasDefault = [
      {
        titulo: "Inception",
        descripcion: "Un ladrón roba secretos a través de los sueños.",
        categoria: "Ciencia Ficción",
        anio: 2010,
        imagen: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SY679_.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Pulp Fiction",
        descripcion: "Historias entrelazadas del crimen en Los Ángeles.",
        categoria: "Drama",
        anio: 1994,
        imagen: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Lion King",
        descripcion: "Un joven león huye tras la muerte de su padre y debe reclamar su trono.",
        categoria: "Animación",
        anio: 1994,
        imagen: "https://image.tmdb.org/t/p/w500/uzERcfV2rSHNhW5eViQiO9hNiA7.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Spirited Away",
        descripcion: "Una niña queda atrapada en un mundo mágico lleno de espíritus.",
        categoria: "Animación",
        anio: 2001,
        imagen: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Goodfellas",
        descripcion: "La vida de un joven que entra en la mafia italiana de Nueva York.",
        categoria: "Drama",
        anio: 1990,
        imagen: "https://image.tmdb.org/t/p/w500/kGzFbGhp99zva6oZODW5atUtnqi.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Godfather",
        descripcion: "La historia de la familia Corleone y su imperio criminal.",
        categoria: "Drama",
        anio: 1972,
        imagen: "https://image.tmdb.org/t/p/w500/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Godfather Part II",
        descripcion: "Continuación de la historia de Michael Corleone y los orígenes de Vito.",
        categoria: "Drama",
        anio: 1974,
        imagen: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Shawshank Redemption",
        descripcion: "Un banquero es encarcelado injustamente y busca esperanza en prisión.",
        categoria: "Drama",
        anio: 1994,
        imagen: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Dark Knight",
        descripcion: "Batman enfrenta al Joker en Gotham.",
        categoria: "Acción",
        anio: 2008,
        imagen: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Forrest Gump",
        descripcion: "Un hombre con bajo coeficiente intelectual vive eventos históricos clave.",
        categoria: "Drama",
        anio: 1994,
        imagen: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Interstellar",
        descripcion: "Exploradores viajan a través de un agujero de gusano para salvar a la humanidad.",
        categoria: "Ciencia Ficción",
        anio: 2014,
        imagen: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Matrix",
        descripcion: "Un hacker descubre la verdad sobre la realidad y lucha contra las máquinas.",
        categoria: "Ciencia Ficción",
        anio: 1999,
        imagen: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Fight Club",
        descripcion: "Un oficinista insomne funda un club secreto de peleas.",
        categoria: "Drama",
        anio: 1999,
        imagen: "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Lord of the Rings: The Fellowship of the Ring",
        descripcion: "Un hobbit emprende un viaje para destruir un anillo poderoso.",
        categoria: "Fantasía",
        anio: 2001,
        imagen: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Star Wars: A New Hope",
        descripcion: "Luke Skywalker se une a la rebelión contra el Imperio Galáctico.",
        categoria: "Ciencia Ficción",
        anio: 1977,
        imagen: "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "The Avengers",
        descripcion: "Los héroes más poderosos de la Tierra se unen para enfrentar a Loki.",
        categoria: "Acción",
        anio: 2012,
        imagen: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Titanic",
        descripcion: "Historia de amor en medio de la tragedia del Titanic.",
        categoria: "Drama",
        anio: 1997,
        imagen: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Spirited Away (2001)",
        descripcion: "La aventura de Chihiro en un mundo mágico lleno de espíritus.",
        categoria: "Animación",
        anio: 2001,
        imagen: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
      {
        titulo: "Parasite",
        descripcion: "Una familia humilde se infiltra en la vida de otra adinerada.",
        categoria: "Drama",
        anio: 2019,
        imagen: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        tipo: "pelicula",
        aprobada: true,
        userId: null,
      },
    ];

    const ops = [];

    for (const p of peliculasDefault) {
      const categoriaDoc = await db.collection("categorias").findOne({ nombre: p.categoria });

      if (!categoriaDoc) {
        console.warn(`⚠️ Categoría '${p.categoria}' no encontrada. Se omite '${p.titulo}'.`);
        continue;
      }

      const peliculaObj = new Pelicula(
        p.titulo,
        p.descripcion,
        categoriaDoc._id,
        p.anio,
        p.imagen,
        p.tipo,
        p.aprobada,
        p.userId,
      );

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
      console.log("✅ Seed ejecutado:", {
        insertados: result.upsertedCount,
        existentes: result.matchedCount,
      });
    } else {
      console.log("ℹ️ No se insertaron nuevas películas.");
    }
  } catch (err) {
    console.error("❌ Error en seedPeliculas:", err);
  }
}
