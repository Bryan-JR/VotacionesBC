import { Router } from "express";
import { Controllers } from "../controllers/Controller.js";

const router = Router();

router.get('/:tabla', Controllers.all);
router.get('/:tabla/:id', Controllers.forId);
router.post('/guardar', Controllers.into);
router.delete('/eliminar/:tabla/:id', Controllers.remove);
router.put('/actualiza/:id', Controllers.update);
router.post('/censo', Controllers.saveCenso);
router.post('/login', Controllers.login);


export const Route = router;