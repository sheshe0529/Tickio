import nodemailer from 'nodemailer';

const gmailConfig = {
  service: 'gmail', // Nodemailer ya sabe la configuración de Gmail
  auth: {
    user: 'ventatickio@gmail.com',         // 👈 Tu dirección de Gmail
    pass: 'qfxpcfugtdbcplft'  // 👈 La contraseña de aplicación (sin espacios)
  }
};

const transporter = nodemailer.createTransport(gmailConfig);

// --- Interfaces (Para saber qué datos enviar) ---
interface OrdenEmail {
  id: number;
  total: number;
}
interface TicketEmail {
  nombre: string;
  apellido: string;
  dni: string;
}
interface UsuarioEmail {
  nombre: string;
  correo: string;
}

// --- La Función de Envío ---
export const enviarEmailConfirmacion = async (
  usuario: UsuarioEmail, 
  orden: OrdenEmail, 
  tickets: TicketEmail[]
) => {
  try {
    // 1. Creamos el contenido HTML del correo
    let ticketsHtml = tickets.map(t => `
      <li>
        <b>Ticket para:</b> ${t.nombre} ${t.apellido} (DNI: ${t.dni})
      </li>
    `).join('');

    const htmlBody = `
      <h1>¡Gracias por tu compra, ${usuario.nombre}!</h1>
      <p>Tu orden <b>#${orden.id}</b> ha sido procesada exitosamente.</p>
      <h3>Detalles de tu compra:</h3>
      <ul>
        ${ticketsHtml}
      </ul>
      <h3>Total Pagado: S/ ${orden.total.toFixed(2)}</h3>
      <p>Pronto podrás ver tus QRs en la sección "Mis Tickets" de la app.</p>
    `;

    // 2. Enviamos el correo
    const info = await transporter.sendMail({
      from: '"Tickio" <ventatickio@gmail.com>', // Remitente
      to: usuario.correo,                         // Destinatario
      subject: `Confirmación de tu Orden #${orden.id}`, // Asunto
      html: htmlBody,                              // Cuerpo (HTML)
    });

    console.log("Correo enviado con Gmail. ID:", info.messageId);
    

  } catch (error) {
    console.error("Error al enviar el email con Gmail:", error);
  }
};