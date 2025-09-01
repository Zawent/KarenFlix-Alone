export class Pelicula {
  constructor(titulo, descripcion, categoriaId, anio, imagen, tipo, aprobada = false, userId) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.categoriaId = categoriaId;
    this.anio = anio;
    this.imagen = imagen;
    this.tipo = tipo; // "pelicula" o "serie"
    this.aprobada = aprobada;
    this.userId = userId;
  }
}
