export class Resena {
  constructor(peliculaId, usuarioId, titulo, comentario, calificacion) {
    this.peliculaId = peliculaId;
    this.usuarioId = usuarioId;
    this.titulo = titulo;
    this.comentario = comentario;
    this.calificacion = calificacion;
    this.likes = [];
    this.dislikes = [];
    this.fechaCreacion = new Date();
  }
}
