import { Request, Response, Router } from 'express';
import prisma from '../../config/prisma';

const router = Router();

// Crear usuario
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      correo,
      contrasena,
      telefono,
      rol,
      Activa,
      tipo1Id,
      tipo2Id,
      tipo3Id,
      RUC,
      razon_social
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !correo || !contrasena || !telefono || !rol || Activa === undefined ||
        !tipo1Id || !tipo2Id || !tipo3Id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena,
        telefono,
        rol,
        Activa,
        tipo1Id,
        tipo2Id,
        tipo3Id,
        RUC,
        razon_social
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});




// ✅ Listar usuarios
router.get('/', async (_req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// ✅ Actualizar usuario
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;
  const usuario = await prisma.usuario.update({
    where: { id: Number(id) },
    data: { nombre, correo },
  });
  res.json(usuario);
});

// ✅ Eliminar usuario
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.usuario.delete({ where: { id: Number(id) } });
  res.json({ message: 'Usuario eliminado' });
});

export default router;
