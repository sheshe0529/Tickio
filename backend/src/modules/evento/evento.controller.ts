import { Request, Response } from "express";
import { Prisma } from "@prisma/client"; // Prisma para errores y TipoEvento para el enum
import prisma from "../../config/prisma"; // instancia única


export const crearEvento = async (req: Request, res: Response) => {
  const {
    nombre,
    descripcion,
    direccion,
    distrito,
    fecha_inicio,
    fecha_fin,
    hora_inicio,
    duracion,
    aforo,
    tipoEvento,
    subtipo,
    usuarioId,
  } = req.body;

  if (!nombre || !tipoEvento || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: nombre, tipoEvento, fecha_inicio, fecha_fin",
    });
  }

  // Validar que las fechas 
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    return res.status(400).json({
      error: "Formato de fecha inválido. Usa formato ISO (YYYY-MM-DDTHH:mm:ssZ)",
    });
  }
  if (fin < inicio) {
    return res.status(400).json({
      error: "La fecha de fin no puede ser anterior a la fecha de inicio.",
    });
  }

  // Validar aforo (no negativo o cero)
  if (aforo !== undefined && aforo <= 0) {
    return res.status(400).json({
      error: "El aforo debe ser mayor a 0.",
    });
  }

  try {
    const evento = await prisma.evento.create({
      data: {
        nombre,
        descripcion,
        direccion,
        distrito,
        fecha_inicio: inicio,
        fecha_fin: fin,
        hora_inicio,
        duracion,
        aforo,
        tipoEvento,
        subtipo,
        estado: "PUBLICADO", 
        usuarioId,
      },
    });

    return res.status(201).json({
      message: "Evento creado exitosamente.",
      evento,
    });
  } catch (error: any) {
    console.error("Error al crear evento:", error);

    // ERRORES ESPECÍFICOS DE PRISMA
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        error: "Datos inválidos. Verifica los campos enviados.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Ya existe un registro con los mismos valores únicos.",
      });
    }

    // ERRORES GENERALES
    return res.status(500).json({
      error: "Error interno del servidor. No se pudo crear el evento.",
      detalle: error.message,
    });
  }
};


// Listar todos los eventos
export const listarEventos = async (_req: Request, res: Response) => {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        tipoTickets: true,
        descuentos: true,
        Usuario: true,
      },
    });
    res.json(eventos);
  } catch (error) {
    console.error("Error al listar eventos:", error);
    res.status(500).json({ error: "Error al listar eventos" });
  }
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const evento = await prisma.evento.findUnique({
      where: { id: Number(id) },
      include: {
        tipoTickets: true,
        descuentos: true,
      },
    });

    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json(evento);
  } catch (error) {
    console.error("Error al obtener evento:", error);
    res.status(500).json({ error: "Error al obtener evento" });
  }
};

export const actualizarEvento = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = { ...req.body };

    // Convertir ID a número y validar
    const idEvento = Number(id);
    if (isNaN(idEvento)) {
      return res.status(400).json({ error: "El ID del evento debe ser un número válido." });
    }

    // Buscar el evento actual para saber si tiene usuario asociado
    const eventoActual = await prisma.evento.findUnique({
      where: { id: idEvento },
      select: { usuarioId: true },
    });

    if (!eventoActual) {
      return res.status(404).json({ error: "El evento no existe o ya fue eliminado." });
    }

    if ("usuarioId" in data) {
      // Si el evento ya tiene usuario asignado y están intentando cambiarlo
      if (eventoActual.usuarioId !== null && eventoActual.usuarioId !== data.usuarioId) {
        return res.status(400).json({
          error: "No está permitido cambiar el usuario asignado. Solo se puede asociar si actualmente es null.",
        });
      }
    }

    data.estado = "MODIFICADO";

    // Ejecutar la actualización
    const evento = await prisma.evento.update({
      where: { id: idEvento },
      data,
    });

    res.json({
      message: "Evento actualizado correctamente. Estado cambiado a MODIFICADO.",
      evento,
    });
  } catch (error: any) {
    console.error("Error al actualizar evento:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "El evento no existe o ya fue eliminado." });
    }

    res.status(500).json({
      error: "Error interno del servidor al actualizar el evento.",
      detalle: error.message,
    });
  }
};

// Eliminar evento
export const eliminarEvento = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Convertir el id a número (y validar)
    const idEvento = Number(id);
    if (isNaN(idEvento)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Verificar si existe el evento
    const evento = await prisma.evento.findUnique({
      where: { id: idEvento },
    });

    if (!evento) {
      return res.status(404).json({ error: `No se encontró el evento con ID ${idEvento}` });
    }

    // Si existe, eliminar
    await prisma.evento.delete({
      where: { id: idEvento },
    });

    res.json({ mensaje: `Evento con ID ${idEvento} eliminado correctamente` });

  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ error: "Error interno al eliminar el evento" });
  }
};

// Listar eventos por usuario
export const listarEventosPorUsuario = async (req: Request, res: Response) => {
  const { usuarioId } = req.params; // se recibirá por la URL

  try {
    const id = Number(usuarioId);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID de usuario debe ser un número válido." });
    }

    const eventos = await prisma.evento.findMany({
      where: { usuarioId: id },
      include: {
        tipoTickets: true,
        descuentos: true,
        Usuario: true, 
      },
    });

    if (eventos.length === 0) {
      return res.status(404).json({
        mensaje: `No se encontraron eventos creados por el usuario con ID ${id}.`,
      });
    }

    res.json(eventos);
  } catch (error) {
    console.error("Error al listar eventos por usuario:", error);
    res.status(500).json({
      error: "Error interno al listar los eventos por usuario.",
    });
  }
};
