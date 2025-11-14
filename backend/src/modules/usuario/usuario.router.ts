import { Router } from "express";
import {
    crearUsuario,
    obtenerUsuarioPorId,
    listarUsuarios,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    getRecomendaciones
} from "./usuario.controller";

const router = Router();

router.post("/login", loginUsuario);
router.post("/",crearUsuario);

// --- RUTAS GET (ORDEN CORREGIDO) ---
router.get("/recomendaciones", getRecomendaciones); // 1. Específica primero
router.get("/",listarUsuarios);                     // 2. Raíz segundo
router.get("/:id",obtenerUsuarioPorId);             // 3. Dinámica (con :id) al final

// --- OTRAS RUTAS ---
router.put("/:id",actualizarUsuario);
router.delete("/:id",eliminarUsuario);

export default router;

