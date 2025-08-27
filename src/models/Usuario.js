export class Usuario {
  constructor({ nombre, email, password, fechaNacimiento = null, rolId = null, fechaRegistro = new Date(), estado = true }) {
    this.nombre = nombre;
    this.email = email;
    this.password = password; 
    this.fechaNacimiento = fechaNacimiento ? new Date(fechaNacimiento) : null;
    this.rolId = rolId; 
    this.fechaRegistro = fechaRegistro;
  }
}
