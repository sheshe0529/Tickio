import { Request, Response, Router } from 'express';
import prisma from '../../config/prisma';



// Crear usuario
//router.post("/", async (req: Request, res: Response) => 
export const crearUsuario = async(req: Request, res: Response) =>
{
  try {
    const {
      nombre,
      correo,
      contrasena,
      telefono,
      rol,
      Activa,
      tipo1,
      tipo2,
      tipo3,
      RUC,
      razon_social,
      distrito
    } = req.body;

    // Validar campos obligatorios
    /*if (!nombre || !correo || !contrasena || !telefono ||
        !tipo1 || !tipo2 || !tipo3) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }*/

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena,
        telefono,
        rol,
        Activa,
        tipo1,
        tipo2,
        tipo3,
        RUC,
        razon_social,
      distrito
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};


// Obtener usuario por ID
//router.get('/:id', async (req: Request, res: Response) => {
export const obtenerUsuarioPorId = async(req: Request, res: Response) =>{
  const { id } = req.params;

  try {
    // Convertir el ID a número (si tu campo ID en Prisma es Int)
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};


// ✅ Listar usuarios
//router.get('/', async (_req: Request, res: Response) => {
export const listarUsuarios = async(req: Request, res: Response) =>{
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
};

// ✅ Actualizar usuario
//router.put('/:id', async (req: Request, res: Response) => {
export const actualizarUsuario = async(req: Request, res: Response) =>{
  try {
    const id = parseInt(req.params.id); // ✅ convertir a número
    const {
      nombre,
      correo,
      contrasena,
      telefono,
      rol,
      Activa,
      tipo1,
      tipo2,
      tipo3,
      RUC,
      razon_social,
      distrito
    } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID no es válido" });
    }

    const usuario = await prisma.usuario.update({
      where: { id },
       data: {
        nombre,
        correo,
        contrasena,
        telefono,
        rol,
        Activa,
        tipo1,
        tipo2,
        tipo3,
        RUC,
        razon_social,
      distrito
      },
    });

    res.json(usuario);
  } catch (error: any) {
    console.error(error);

    // Prisma lanza error si el id no existe
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};


// ✅ Eliminar usuario
//router.delete('/:id', async (req: Request, res: Response) => {
export const eliminarUsuario = async(req: Request, res: Response) =>{
  const { id } = req.params;
  await prisma.usuario.delete({ where: { id: Number(id) } });
  res.json({ message: 'Usuario eliminado' });

};


export const loginUsuario = async (req: Request, res: Response) => {
  const { correo, contrasena } = req.body;

  try {
    // 1. Buscar el usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: { correo: correo },
    });

    // 2. Si no existe el usuario O la contraseña no coincide
    if (!usuario || usuario.contrasena !== contrasena) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    // 3. Si todo está bien, devolver el usuario (sin la contraseña por seguridad)
    const { contrasena: _, ...usuarioSinPass } = usuario;
    res.json(usuarioSinPass);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

