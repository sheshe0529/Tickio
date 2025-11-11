import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { Distrito } from "@prisma/client"; // 👈 Importamos el enum Distrito


export const obtenerDistrito = (req : Request, res: Response)=>{
    try{
        const distritos = Object.values(Distrito);
        res.json(distritos);
    } catch (error){
        console.error('Error al obtener distrito: ', error);
        res.status(500).json({message: 'Error al obtener distritos'});
    }
  }



export const buscarEventosPorDistrito = async (req: Request, res: Response) => {
  try {
    const { distrito } = req.params;

    // 👇 Validamos que el distrito sea un valor válido del enum
    if (!Object.values(Distrito).includes(distrito as Distrito)) {
      return res.status(400).json({ error: "Distrito no válido" });
    }

    // 👇 Buscamos eventos filtrando por el distrito
    const eventos = await prisma.evento.findMany({
      where: { distrito: distrito as Distrito },
    });

    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al buscar eventos por distrito" });
  }

};