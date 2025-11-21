import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { TipoEvento, SubtipoEvento } from "@prisma/client"; // 👈 Ambos enums

export const buscarEventos = async (req: Request, res: Response) => {
  try {
    const { tipoEvento, subtipo } = req.query;

    // Creamos el objeto de filtros vacío
    const filtros: any = {};

    // Validamos tipoEvento solo si se pasa y es válido
    if (tipoEvento && Object.values(TipoEvento).includes(tipoEvento as TipoEvento)) {
      filtros.tipoEvento = tipoEvento as TipoEvento;
    }

    // Validamos subtipo solo si se pasa y es válido
    if (subtipo && Object.values(SubtipoEvento).includes(subtipo as SubtipoEvento)) {
      filtros.subtipo = subtipo as SubtipoEvento;
    }

    // Buscar eventos usando filtros opcionales
    const eventos = await prisma.evento.findMany({
      where: filtros,
    });

    res.json(eventos);
  } catch (error) {
    console.error("Error al buscar eventos:", error);
    res.status(500).json({ error: "Error al buscar eventos" });
  }
};


export const listarFavoritos = async (req: Request, res: Response) => {
  const { usuarioId } = req.params;

  try {
    const id = Number(usuarioId);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID de usuario debe ser un número válido.",
      });
    }
    return res.json(usuarioId);
    
  } catch (error) {
    console.error("Error al listar eventos recomendados por usuario:", error);
    return res.status(500).json({
      error: "Error interno al listar los eventos recomendados.",
    });
  }
};