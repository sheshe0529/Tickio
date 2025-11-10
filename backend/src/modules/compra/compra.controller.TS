import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const realizarCompra = async (req: Request, res: Response) => {
  const { usuarioId, tipoTicketId, nombre, apellido, dni, cantidad} = req.body;

  try {
    // Buscar tipo de ticket
    const tipoTicket = await prisma.tipo_Ticket.findUnique({
      where: { id: tipoTicketId },
    });

    if (!tipoTicket) {
      return res.status(404).json({ error: "Tipo de ticket no encontrado" });
    }

    // Verificar stock
    if (tipoTicket.cantidad < cantidad) {
      return res.status(400).json({ error: "Entradas agotadas para este tipo de ticket" });
    }

    // Crear orden y tickets en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const orden = await tx.orden.create({
        data: {
          estado: "PENDIENTE",
          total: tipoTicket.precio * cantidad,
          estadoPago: "NO PAGADO",
        },
      });

      const tickets = [];
      for (let i = 0; i < cantidad; i++) {
        const ticket = await tx.ticket.create({
          data: {
            fechaEmision: new Date(),
            qr: null,
            nombre,
            apellido,
            dni,
            estado: "GENERADO",
            tipoTicketId,
            usuarioId,
            ordenId: orden.id,
          },
        });
        tickets.push(ticket);
      }

      await tx.tipo_Ticket.update({
        where: { id: tipoTicketId },
        data: { cantidad: tipoTicket.cantidad - cantidad },
      });

      return { orden, tickets };
    });

    res.json(result);
    } catch (error) {
    console.error("Error en realizarCompra:", error);
    res.status(500).json({ error: "Error al procesar la compra", details: error });
    }


};

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
