import { Request, Response, Router } from "express";
import prisma from "../../config/prisma";

const router = Router();

// ✅ Crear usuario
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      correo,
      contrasena,
      telefono,
      rol,
      Activa,
      distrito,        // Enum Distrito
      tipo1,           // Enum TipoEvento?
      tipo2,           // Enum TipoEvento?
      tipo3,           // Enum TipoEvento?
      RUC,
      razon_social,
    } = req.body;

    // Validar campos obligatorios
    if (
      !nombre ||
      !correo ||
      !contrasena ||
      !telefono ||
      !rol ||
      Activa === undefined ||
      !distrito
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Convertir Activa a número
    const activaNum = Number(Activa);
    if (Number.isNaN(activaNum)) {
      return res.status(400).json({ error: "El campo Activa debe ser numérico" });
    }

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena,
        telefono,
        rol,
        Activa: activaNum,
        distrito,           // Enum Distrito (ej: "MIRAFLORES")
        tipo1: tipo1 ?? null,
        tipo2: tipo2 ?? null,
        tipo3: tipo3 ?? null,
        RUC: RUC ?? null,
        razon_social: razon_social ?? null,
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// ✅ Listar usuarios
router.get("/", async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// ✅ Actualizar usuario
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      correo,
      telefono,
      rol,
      Activa,
      distrito,
      tipo1,
      tipo2,
      tipo3,
      RUC,
      razon_social,
    } = req.body;

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nombre,
        correo,
        telefono,
        rol,
        Activa: Activa !== undefined ? Number(Activa) : undefined,
        distrito,
        tipo1,
        tipo2,
        tipo3,
        RUC,
        razon_social,
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// ✅ Eliminar usuario
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
