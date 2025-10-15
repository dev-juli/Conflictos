import Router from "express";
import httpHeadquarters from "../controllers/headquarters.js"

const routes = Router();

routes.get("/", httpHeadquarters.listAll);
routes.get("/:id", httpHeadquarters.listById);
routes.get("/colegios/:colegioId/sedes", httpHeadquarters.headquartersBySchool);
routes.post("/", httpHeadquarters.createHeadquarters);
routes.put("/:id", httpHeadquarters.updateHeadquarters);
routes.put("/:id/activar", httpHeadquarters.activateHeadquarters);
routes.put("/:id/inactivar", httpHeadquarters.deactivateHeadquarters);
routes.delete("/:id", httpHeadquarters.deleteHeadquaters);

export default routes;