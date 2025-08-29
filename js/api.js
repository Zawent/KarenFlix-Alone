const API_URL = "http://localhost:3000/api"; // cambia por tu backend real

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    alert("Error: " + err.message);
    throw err;
  }
}