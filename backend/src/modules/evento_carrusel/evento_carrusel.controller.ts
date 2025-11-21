import { Request, Response } from "express";
import { Prisma } from "@prisma/client"; // Prisma para errores y TipoEvento para el enum
import prisma from "../../config/prisma"; // instancia única

import { TipoEvento } from '@prisma/client';

export const listarEventosFavoritos = async (req: Request, res: Response) => {
  const { userId } = req.params; // se recibirá por la URL

  try {
    const id = Number(userId);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID de usuario debe ser un número válido." });
    }
    // 1. Obtenemos al usuario y sus tipos preferidos
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        tipo1: true,
        tipo2: true,
        tipo3: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: `No se encontró el usuario con ID ${id}.`,
      });
    }

    // Armamos el array de preferencias (quitando los null)
    const tiposPreferidos = [usuario.tipo1, usuario.tipo2, usuario.tipo3].filter(
      (t): t is TipoEvento => t !== null
    );

    // 2. Buscamos eventos futuros que coincidan con las preferencias del usuario
    const eventos = await prisma.evento.findMany({
      where: {
        fecha_inicio: {
          gte: new Date(), // solo eventos futuros
        },
        ...(tiposPreferidos.length > 0
          ? { tipoEvento: { in: tiposPreferidos } }
          : {}), // si no tiene preferencias, no filtramos por tipoEvento
      },
      include: {
        tipoTickets: {
          include: {
            _count: {
              select: { tickets: true }, // cuántos tickets tiene cada tipo
            },
          },
        },
        descuentos: true,
        Usuario: true,
      },
    });

    if (eventos.length === 0) {
      return res.status(404).json({
        mensaje: `No se encontraron eventos para las preferencias del usuario con ID ${id}.`,
      });
    }

    // 3. Calculamos el total de tickets por evento y ordenamos en memoria
    const eventosOrdenados = eventos
      .map((evento) => {
        const totalTickets = evento.tipoTickets.reduce(
          (suma, tipoTicket) => suma + tipoTicket._count.tickets,
          0
        );

        return {
          ...evento,
          totalTickets, // campo extra calculado (puedes devolverlo al frontend)
        };
      })
      .sort((a, b) => b.totalTickets - a.totalTickets) // más vendidos primero
      .slice(0, 3); // solo los 3 primeros

    return res.json(eventosOrdenados);
  } catch (error) {
    console.error("Error al listar eventos recomendados por usuario:", error);
    return res.status(500).json({
      error: "Error interno al listar los eventos recomendados.",
    });
  }
};
