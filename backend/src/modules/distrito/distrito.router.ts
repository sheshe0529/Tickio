
import express from "express";
import { obtenerDistrito } from "./distrito.controller";

import { Router } from "express";
import { buscarEventosPorDistrito } from "./distrito.controller";

const router = Router();

//get
router.get('/',obtenerDistrito);
// Ruta GET para buscar eventos por distrito
router.get("/buscar/:distrito", buscarEventosPorDistrito);

export default router;

