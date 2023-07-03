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
router.get('/tablas/:tab1/:tab2', Controllers.dosTablas);
router.get('/get/candidatos/:idCon/:ident', Controllers.candidatos);
router.get('/candidatos/elecciones/:id', Controllers.candidatosByE);
router.get('/:tabla/:tipo/:id', Controllers.notificaciones);


export const Route = router;