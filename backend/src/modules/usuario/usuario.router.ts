import { Router } from "express";
import {
    crearUsuario,
    obtenerUsuarioPorId,
    listarUsuarios,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario
} from "./usuario.controller";

const router = Router();

router.post("/login", loginUsuario);
router.post("/",crearUsuario);
router.get("/:id",obtenerUsuarioPorId)
router.get("/",listarUsuarios);
router.put("/:id",actualizarUsuario);
router.delete("/:id",eliminarUsuario);

export default router;

