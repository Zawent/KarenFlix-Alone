import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};


export const authorizeRoles = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ msg: "Acceso denegado. No tienes permisos suficientes." });
    }
    next();
  };
};
