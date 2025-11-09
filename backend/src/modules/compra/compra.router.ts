import { Router } from "express";
import {
  realizarCompra,
  listarComprasUsuario,
  obtenerCompraPorId,
  cancelarCompra,
} from "./compra.controller";

const router = Router();

router.post("/", realizarCompra);
router.get("/usuario/:id", listarComprasUsuario);
router.get("/:id", obtenerCompraPorId);
router.put("/:id/cancelar", cancelarCompra);

export default router;  