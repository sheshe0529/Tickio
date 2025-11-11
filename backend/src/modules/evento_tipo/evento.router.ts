import express from 'express';
import { buscarEventos } from "./evento.controller";

const router = express.Router();

// Ruta de búsqueda
router.get('/filtros', buscarEventos);

export default router;
