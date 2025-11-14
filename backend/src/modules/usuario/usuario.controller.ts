import { Request, Response, Router } from 'express';
import prisma from '../../config/prisma';



// Crear usuario
//router.post("/", async (req: Request, res: Response) => 
export const crearUsuario = async(req: Request, res: Response) =>
{
  try {
    const {
      nombre, correo, contrasena, telefono, rol, Activa,
      tipo1, tipo2, tipo3, RUC, razon_social, distrito
    } = req.body;

    // --- VERIFICACIÓN AÑADIDA ---
    // 1. Buscamos si el correo ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: correo },
    });

    // 2. Si existe, enviamos un error 409 (Conflicto)
    if (existingUser) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }
    // --- FIN DE LA VERIFICACIÓN ---

    // 3. Si no existe, procedemos a crearlo
    const usuario = await prisma.usuario.create({
      data: {
        nombre, correo, contrasena, telefono, rol, Activa,
        tipo1, tipo2, tipo3, RUC, razon_social, distrito
      },
    });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    // Error genérico por si falla otra cosa
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

export const getRecomendaciones = async (req: Request, res: Response) => {
  const { usuarioId } = req.query;

  try {
    const where: any = {
      fecha_inicio: { gte: new Date() } // Solo eventos futuros
    };

    let preferencias: string[] = [];

    // 1. Si tenemos un usuario, buscamos sus gustos
    if (usuarioId) {
      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioId) },
        select: { tipo1: true, tipo2: true, tipo3: true }
      });
      
      if (usuario) {
        preferencias = [usuario.tipo1, usuario.tipo2, usuario.tipo3].filter(Boolean) as string[];
      }
    }

    // 2. Si hay gustos, los añadimos al filtro
    if (preferencias.length > 0) {
      where.tipoEvento = { in: preferencias };
    }
    
    // 3. Buscamos eventos que coincidan
    let eventos = await prisma.evento.findMany({
      where: where,
      take: 3 // Queremos solo 3
    });

    // 4. Si no encontramos 3 (o no había gustos), rellenamos con cualquiera
    if (eventos.length < 3) {
      const idsExcluir = eventos.map(e => e.id);
      const eventosRelleno = await prisma.evento.findMany({
        where: {
          fecha_inicio: { gte: new Date() },
          id: { notIn: idsExcluir } // Que no sean los que ya tenemos
        },
        take: 3 - eventos.length // Solo los que faltan
      });
      eventos = [...eventos, ...eventosRelleno];
    }
    
    res.json(eventos);

  } catch (error) {
    console.error("Error en recomendaciones:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
};