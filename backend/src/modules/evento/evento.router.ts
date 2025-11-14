import { Router } from "express";
import {
  crearEvento,
  listarEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  listarEventosPorUsuario, 
  listarEventosPorOrganizador,
  getReporteVentas,
  getReporteGeneralOrganizador
} from "./evento.controller";

const router = Router();

// ENDPOINTS CRUD
router.post("/", crearEvento);           // CREATE
router.get("/", listarEventos);          // READ (todos)
router.get("/usuario/:usuarioId", listarEventosPorUsuario); // listar por usuario
router.get("/organizador/:id", listarEventosPorOrganizador);
router.get("/:id/reporte", getReporteVentas);
router.get("/organizador/reporte-general/:id", getReporteGeneralOrganizador);
router.get("/:id", obtenerEventoPorId);  // READ (por id)
router.put("/:id", actualizarEvento);    // UPDATE
router.delete("/:id", eliminarEvento);   // DELETE

export default router;
