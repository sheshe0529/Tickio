import { Request, Response } from 'express';
import { TipoEvento } from '@prisma/client'; // 👈 Importa directamente el enum

export const obtenerTiposDeEvento = (req: Request, res: Response) => {
  try {
    const tipos = Object.values(TipoEvento); // 👈 Convierte el enum a array
    res.json(tipos); // Devuelve los valores en formato JSON
  } catch (error) {
    console.error('Error al obtener tipos de evento:', error);
    res.status(500).json({ message: 'Error al obtener tipos de evento' });
  }
};