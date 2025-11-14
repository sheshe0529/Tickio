import { Request, Response } from "express";
import { Prisma } from "@prisma/client"; // Prisma para errores y TipoEvento para el enum
import prisma from "../../config/prisma"; // instancia única

interface TipoTicketData {
  nombre: string;
  precio: number;
  cantidad: number;
}

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
    tipoTickets // 👈 NUEVO: Esperamos un array de tickets
  } = req.body as { 
    tipoTickets: TipoTicketData[] 
  } & Omit<Prisma.EventoCreateInput, 'Usuario' | 'embedding' | 'tipoTickets' | 'descuentos'> & {
    usuarioId: number // Aseguramos que usuarioId es un número
  };

  // --- VALIDACIONES ---
  if (!nombre || !tipoEvento || !fecha_inicio || !fecha_fin || !usuarioId) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: nombre, tipoEvento, fechas, o usuarioId",
    });
  }
  if (!tipoTickets || tipoTickets.length === 0) {
    return res.status(400).json({ error: "Debes agregar al menos un tipo de ticket." });
  }
  // ... (tus otras validaciones de fecha y aforo) ...

  try {
    // --- TRANSACCIÓN ---
    // Creamos el evento Y sus tickets al mismo tiempo.
    const resultado = await prisma.$transaction(async (tx) => {
      
      // 1. Creamos el Evento
      const evento = await tx.evento.create({
        data: {
          nombre,
          descripcion,
          direccion,
          distrito,
          fecha_inicio: new Date(fecha_inicio),
          fecha_fin: new Date(fecha_fin),
          hora_inicio: Number(hora_inicio),
          duracion: Number(duracion),
          aforo: Number(aforo),
          tipoEvento,
          subtipo,
          estado: "PENDIENTE", 
          usuarioId: Number(usuarioId),
        },
      });

      // 2. Preparamos los datos de los Tipo_Ticket
      const ticketsData = tipoTickets.map(ticket => ({
        nombre: ticket.nombre,
        precio: Number(ticket.precio),
        cantidad: Number(ticket.cantidad),
        eventoId: evento.id // Vinculamos al evento recién creado
      }));

      // 3. Creamos los Tipo_Ticket
      await tx.tipo_Ticket.createMany({
        data: ticketsData,
      });

      return evento; // Devolvemos el evento principal
    });

    return res.status(201).json({
      message: "Evento y tickets creados exitosamente.",
      evento: resultado,
    });

  } catch (error: any) {
    console.error("Error al crear evento:", error);
    // ... (tus manejos de error de Prisma) ...
    return res.status(500).json({
      error: "Error interno del servidor.",
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

export const listarEventosPorOrganizador = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del organizador (usuario)

  try {
    const eventos = await prisma.evento.findMany({
      where: {
        usuarioId: Number(id)
      },
      orderBy: {
        fecha_inicio: 'desc'
      }
    });
    res.json(eventos);
  } catch (error) {
    console.error('Error al listar eventos por organizador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// En evento.controller.ts (al final)

export const getReporteVentas = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del Evento

  try {
    // 1. Buscamos el evento y sus tipos de ticket
    const tiposDeTicket = await prisma.tipo_Ticket.findMany({
      where: { eventoId: Number(id) },
      include: {
        // 2. Usamos _count para contar cuántos 'tickets' (vendidos)
        // están asociados a CADA tipo de ticket
        _count: {
          select: { tickets: true }
        }
      }
    });

    if (!tiposDeTicket || tiposDeTicket.length === 0) {
      return res.status(404).json({ error: "No se encontraron tipos de ticket para este evento" });
    }

    // 3. Formateamos la respuesta como la pediste
    const reporte = tiposDeTicket.map(tipo => {
      const vendidos = tipo._count.tickets;
      const totalSoles = vendidos * tipo.precio;
      
      return {
        tipoTicket: tipo.nombre,
        unidadesVendidas: vendidos,
        precioUnitario: tipo.precio,
        totalSoles: totalSoles
      };
    });

    res.json(reporte);

  } catch (error) {
    console.error('Error al generar reporte de ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// En evento.controller.ts (al final)

export const getReporteGeneralOrganizador = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del Organizador (usuario)

  try {
    // 1. Buscamos todos los eventos del organizador
    const eventos = await prisma.evento.findMany({
      where: { usuarioId: Number(id) },
      select: {
        id: true,
        nombre: true,
        // 2. Incluimos los tipoTickets de CADA evento
        tipoTickets: {
          select: {
            nombre: true,
            precio: true,
            // 3. Incluimos el conteo de tickets vendidos de CADA tipoTicket
            _count: {
              select: { tickets: true }
            }
          }
        }
      }
    });

    if (eventos.length === 0) {
      return res.status(404).json({ error: "Este organizador no tiene eventos." });
    }

    // 4. Formateamos la data como la pediste
    const reporteGeneral = eventos.map(evento => {
      const tiposDeTicket = evento.tipoTickets.map(tipo => {
        const vendidos = tipo._count.tickets;
        const totalSoles = vendidos * tipo.precio;
        return {
          tipoNombre: tipo.nombre,
          unidadesVendidas: vendidos,
          precioUnitario: tipo.precio,
          totalSoles: totalSoles
        };
      });
      
      return {
        eventoId: evento.id,
        eventoNombre: evento.nombre,
        tiposDeTicket: tiposDeTicket
      };
    });

    res.json(reporteGeneral);

  } catch (error) {
    console.error('Error al generar reporte general:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};