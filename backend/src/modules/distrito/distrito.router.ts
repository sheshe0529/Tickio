import { Router } from "express";
import { buscarEventosPorDistrito } from "./distrito.controller";

const router = Router();

// Ruta GET para buscar eventos por distrito
router.get("/buscar/:distrito", buscarEventosPorDistrito);

export default router;
