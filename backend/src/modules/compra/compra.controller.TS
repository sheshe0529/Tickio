import { Request, Response } from 'express';
import prisma from '../../config/prisma';

import QRCode from 'qrcode';
import { enviarEmailConfirmacion } from '../../lib/email';
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
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { nombre: true, correo: true } // Solo traemos lo que necesitamos
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
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

    enviarEmailConfirmacion(
      { nombre: usuario.nombre, correo: usuario.correo },
      { id: result.orden.id, total: result.orden.total },
      result.ticketsCreados
    ).catch(err => console.error("Error al enviar email (segundo plano):", err));
    
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
  const { id } = req.params;
  try {
    const compras = await prisma.orden.findMany({
      where: { tickets: { some: { usuarioId: Number(id) } } },
      include: {
        tickets: {
          include: {
            tipoTicket: { include: { evento: true } },
          },
        },
      },
    });
    res.json(compras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar compras del usuario" });
  }
};


export const obtenerCompraPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const compra = await prisma.orden.findUnique({
      where: { id: Number(id) },
      include: {
        tickets: {
          include: {
            tipoTicket: { include: { evento: true } },
          },
        },
      },
    });
    if (!compra) return res.status(404).json({ error: "Compra no encontrada" });
    res.json(compra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener compra" });
  }
};


export const cancelarCompra = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const orden = await prisma.orden.findUnique({
      where: { id: Number(id) },
      include: { tickets: true },
    });

    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    if (orden.estado === "CANCELADA")
      return res.status(400).json({ error: "La orden ya está cancelada" });

    await prisma.$transaction(async (tx) => {
      for (const ticket of orden.tickets) {
        await tx.tipo_Ticket.update({
          where: { id: ticket.tipoTicketId },
          data: { cantidad: { increment: 1 } },
        });
      }

      await tx.orden.update({
        where: { id: orden.id },
        data: { estado: "CANCELADA", estadoPago: "ANULADO" },
      });

      await tx.ticket.updateMany({
        where: { ordenId: orden.id },
        data: { estado: "CANCELADO" },
      });
    });

    res.json({ message: "Compra cancelada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cancelar la compra" });
  }
};

export const generarQRparaTicket = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del Ticket

  try {
    // 1. (Opcional pero recomendado) Validar que el ticket exista
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    // 2. Definimos el texto que irá en el QR (simple o complejo)
    // Usaremos un JSON simple como ejemplo.
    const qrData = JSON.stringify({
      ticketId: ticket.id,
      dni: ticket.dni,
      eventoId: ticket.tipoTicketId, // (Puedes hacer un 'include' para tener más datos si quieres)
    });

    // 3. Generamos el QR como una imagen PNG (en formato Data URL)
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    // 4. Enviamos la imagen
    // (En un escenario real, enviaríamos la imagen, pero para web es más fácil enviar el Data URL)
    res.json({ qrDataUrl: qrCodeDataURL });

  } catch (error) {
    console.error("Error generando QR:", error);
    res.status(500).json({ error: "Error al generar el QR" });
  }
};