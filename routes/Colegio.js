import Router from "express";
import httpSchools from "../controllers/Colegios.js";

const routes = Router()

routes.get("/api/schools/", httpSchools.getSchools);
routes.get("/api/schools/:id", httpSchools.getSchoolById);
routes.post("/api/schools", httpSchools.createSchool);
routes.put("/api/schools/:id", httpSchools.updateSchool);
routes.put("/api/schools/:id/activate", httpSchools.activateSchool);      // Route to activate
routes.put("/api/schools/:id/deactivate", httpSchools.deactivateSchool);
routes.delete("/api/schools/:id", httpSchools.deleteSchool);
export default routes