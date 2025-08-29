import { apiFetch } from "./api.js";

const form = document.getElementById("movieForm");
const adminList = document.getElementById("adminList");

async function loadMovies() {
  const movies = await apiFetch("/movies");
  adminList.innerHTML = movies.map(m => `
    <div>
      <h3>${m.title}</h3>
      <p>${m.genre}</p>
      <button onclick="deleteMovie('${m._id}')">Eliminar</button>
    </div>
  `).join("");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const newMovie = {
    title: form.title.value,
    genre: form.genre.value,
    description: form.description.value,
  };
  await apiFetch("/movies", {
    method: "POST",
    body: JSON.stringify(newMovie)
  });
  form.reset();
  loadMovies();
});

window.deleteMovie = async id => {
  await apiFetch(`/movies/${id}`, { method: "DELETE" });
  loadMovies();
};

loadMovies();