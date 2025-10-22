export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.headers["rol"];

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "No se proporcionó el rol del usuario",
      });
    }

    // Convertir todo a minúsculas para comparación insensible a mayúsculas/minúsculas
    const normalizedRole = userRole.toString().trim().toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    // Guardamos el rol procesado para uso posterior (si se necesita)
    req.userRole = normalizedRole;

    next();
  };
};
