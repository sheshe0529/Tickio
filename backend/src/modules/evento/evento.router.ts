import { Router } from "express";
import {
  crearEvento,
  listarEventos,
  listarEventosPorTipo,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
} from "./evento.controller";

const router = Router();

// ENDPOINTS CRUD
router.post("/", crearEvento);       // CREATE
router.get("/", listarEventos);      // READ (todos)
router.get("/tipo/:tipo", listarEventosPorTipo);
router.get("/:id", obtenerEventoPorId); // READ (por id)
router.put("/:id", actualizarEvento);   // UPDATE
router.delete("/:id", eliminarEvento);  // DELETE

export default router;
