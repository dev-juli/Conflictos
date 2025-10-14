import Router from "express";
import httppColegios from "../controllers/Colegios.js";

const routes = Router()

routes.get("/api/colegios/", httppColegios.obtenerColegios);
routes.get("/api/colegios/:id", httppColegios.obtenerColegioId);
routes.post("/api/colegios", httppColegios.crearColegio);
routes.put("/api/colegios/:id", httppColegios.actualizarColegio);
routes.put("/api/colegios/:id/activar", httppColegios.activarColegio);      // Ruta para activar
routes.put("/api/colegios/:id/desactivar", httppColegios.desactivarColegio);
routes.delete("/api/colegios/:id", httppColegios.borrarColegio);
export default routes