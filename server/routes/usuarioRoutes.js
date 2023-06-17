import { Router } from "express";
import { Controllers } from "../controllers/usuarioController.js";

const router = Router();

router.get('/:tabla', Controllers.all);


export const Route = router;