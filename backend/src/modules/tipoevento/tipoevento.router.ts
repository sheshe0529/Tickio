import express from 'express';
import { obtenerTiposDeEvento } from './tipoevento.controller';

const router = express.Router();

// GET /api/tipo-eventos
router.get('/tipo-eventos', obtenerTiposDeEvento);

export default router;