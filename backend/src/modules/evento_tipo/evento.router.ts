import express from 'express';
import { buscarEventos, listarFavoritos } from "./evento.controller";

const router = express.Router();

// Ruta de búsqueda
router.get('/filtros', buscarEventos);
router.get('/listarFavs/:userId', listarFavoritos);

export default router;
