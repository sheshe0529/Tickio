import { Router } from "express";
import {
    listarEventosFavoritos
} from "./evento_carrusel.controller";

const router = Router();

// ENDPOINTS CRUD
router.get('/:userId', listarEventosFavoritos);

export default router;