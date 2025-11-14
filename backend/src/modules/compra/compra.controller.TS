import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// 1. DEFINIMOS LA FORMA DE LOS DATOS QUE LLEGARÁN
interface TicketData {
  tipoTicketId: number;
  nombre: string;
  apellido: string;
  dni: string;
}

interface RealizarCompraBody {
  usuarioId: number;
  tickets: TicketData[]; // Ahora esperamos un array
}

export const realizarCompra = async (req: Request, res: Response) => {
  const { usuarioId, tickets } = req.body as RealizarCompraBody;

  if (!usuarioId || !tickets || tickets.length === 0) {
    return res.status(400).json({ error: "Faltan datos (usuarioId o tickets)" });
  }

  try {
    // 2. Agrupamos los tickets para saber cuántos de cada tipo son
    const ticketCounts: Map<number, number> = new Map();
    let totalAPagar = 0;

    for (const ticket of tickets) {
      ticketCounts.set(ticket.tipoTicketId, (ticketCounts.get(ticket.tipoTicketId) || 0) + 1);
    }

    const result = await prisma.$transaction(async (tx) => {
      
      // 3. Verificamos stock y calculamos el total
      for (const [tipoTicketId, cantidad] of ticketCounts.entries()) {
        const tipoTicket = await tx.tipo_Ticket.findUnique({
          where: { id: tipoTicketId },
        });

        if (!tipoTicket) {
          throw new Error(`Tipo de ticket ID ${tipoTicketId} no encontrado`);
        }
        if (tipoTicket.cantidad < cantidad) {
          throw new Error(`Entradas agotadas para ${tipoTicket.nombre}`);
        }

        // Actualizamos el stock
        await tx.tipo_Ticket.update({
          where: { id: tipoTicketId },
          data: { cantidad: { decrement: cantidad } },
        });

        // Sumamos al total
        totalAPagar += tipoTicket.precio * cantidad;
      }

      // 4. Creamos UNA sola Orden
      const orden = await tx.orden.create({
        data: {
          estado: "ACEPTADO", // O "COMPLETADO" si el pago es instantáneo
          total: totalAPagar,
          estadoPago: "PAGADO", // Asumimos que el pago fue exitoso
        },
      });

      // 5. Creamos los tickets individuales con sus datos
      const ticketsCreados = [];
      for (const ticketData of tickets) {
        const ticket = await tx.ticket.create({
          data: {
            fechaEmision: new Date(),
            qr: null, // Generar QR en otro proceso
            estado: "GENERADO",
            ordenId: orden.id,
            usuarioId: usuarioId, // El ID del comprador
            // Los datos del propietario (dueño) del ticket
            tipoTicketId: ticketData.tipoTicketId,
            nombre: ticketData.nombre,
            apellido: ticketData.apellido,
            dni: ticketData.dni,
          },
        });
        ticketsCreados.push(ticket);
      }

      return { orden, ticketsCreados };
    });

    res.json(result);

  } catch (error) {
    console.error("Error en realizarCompra:", error);
    const errorMessage = (error instanceof Error) ? error.message : "Error al procesar la compra";
    res.status(500).json({ error: errorMessage });
  }
};

// --- TUS OTRAS FUNCIONES ---
// (Pega aquí el resto de tus funciones: listarComprasUsuario, obtenerCompraPorId, etc.)

export const listarComprasUsuario = async (req: Request, res: Response) => {
  // ... (tu código)
};

export const obtenerCompraPorId = async (req: Request, res: Response) => {
  // ... (tu código)
};

export const cancelarCompra = async (req: Request, res: Response) => {
  // ... (tu código)
};