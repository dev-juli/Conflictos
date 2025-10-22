import { Router } from "express";
import * as materiasCtrl from "../controllers/materiasController.js";
import { checkRole } from "../middlewares/authRoles.js";

const router = Router();
//Rector y Coordinador solo pueden listar
router.get("/", checkRole(["rector", "coordinador", "secretaria"]), materiasCtrl.getAll);
router.get("/area/:id", checkRole(["rector", "coordinador", "secretaria"]), materiasCtrl.getByArea);
router.get("/:id", checkRole(["rector", "coordinador", "secretaria"]), materiasCtrl.getById);

//Solo Secretaria puede modificar
router.post("/", checkRole(["secretaria"]), materiasCtrl.create);
router.put("/:id", checkRole(["secretaria"]), materiasCtrl.update);
router.put("/:id/activar", checkRole(["secretaria"]), materiasCtrl.activate);
router.put("/:id/desactivar", checkRole(["secretaria"]), materiasCtrl.deactivate);
router.delete("/:id", checkRole(["secretaria"]), materiasCtrl.remove);

export default router;
