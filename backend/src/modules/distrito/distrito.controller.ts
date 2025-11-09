import { Request, Response } from "express";
import { Distrito } from "@prisma/client";

export const obtenerDistrito = (req : Request, res: Response)=>{
    try{
        const distritos = Object.values(Distrito);
        res.json(distritos);
    } catch (error){
        console.error('Error al obtener distrito: ', error);
        res.status(500).json({message: 'Error al obtener distritos'});
    }

};