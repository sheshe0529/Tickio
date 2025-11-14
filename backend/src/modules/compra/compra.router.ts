import { Router } from "express";
import {
  realizarCompra,
  listarComprasUsuario,
  obtenerCompraPorId,
  cancelarCompra,
  generarQRparaTicket,
} from "./compra.controller";

const router = Router();

router.post("/", realizarCompra);
router.get("/usuario/:id", listarComprasUsuario);
router.get("/:id", obtenerCompraPorId);
router.put("/:id/cancelar", cancelarCompra);
router.get("/ticket/:id/qr", generarQRparaTicket);

export default router;  