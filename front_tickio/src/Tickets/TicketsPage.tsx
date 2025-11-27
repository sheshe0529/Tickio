import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaQrcode } from 'react-icons/fa';
import './Tickets.css'; // 👈 1. CAMBIA EL IMPORT DEL CSS

// ... (Las interfaces Orden, Ticket, etc. quedan igual) ...
interface Evento {
  nombre: string;
}
interface TipoTicket {
  nombre: string;
  evento: Evento;
}
interface Ticket {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  estado: string;
  tipoTicket: TipoTicket;
}
interface Orden {
  id: number;
  estado: string;
  total: number;
  estadoPago: string;
  tickets: Ticket[];
}


function TicketsPage() { // 👈 2. CAMBIA EL NOMBRE DE LA FUNCIÓN
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  useEffect(() => {
    document.title = 'Tickio - Mis Tickets';
  }, []);
  useEffect(() => {
    if (!user) {
      // 3. CAMBIA EL REDIRECT
      navigate('/login?redirect=/tickets'); 
      return;
    }

    const fetchCompras = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/compras/usuario/${user.id}`);
        
        if (!response.ok) {
          throw new Error('No se pudieron cargar las compras');
        }
        const data: Orden[] = await response.json();
        setOrdenes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [user, navigate]);

  const handleShowQr = async (ticketId: number) => {
    try {
      setLoadingQr(true);
      setQrModalUrl(null); // Limpia el QR anterior

      const response = await fetch(`http://localhost:3000/compras/ticket/${ticketId}/qr`);
      if (!response.ok) throw new Error("No se pudo generar el QR");

      const data = await response.json();
      setQrModalUrl(data.qrDataUrl); // Guardamos la URL de la imagen QR

    } catch (error) {
      console.error(error);
      alert("Error al cargar el QR.");
    } finally {
      setLoadingQr(false);
    }
  };

  if (loading) {
    // 4. CAMBIA LA CLASE CSS
    return <div className="tickets-page loading"><h2>Cargando tus tickets...</h2></div>;
  }

  if (ordenes.length === 0) {
    // 5. CAMBIA LA CLASE CSS
    return (
      <div className="tickets-page empty">
        <h2>No tienes tickets</h2>
        <p>Aún no has comprado ningún ticket. ¡Busca tu próximo evento!</p>
        <Link to="/" className="btn-primary-compras">Buscar Eventos</Link>
      </div>
    );
  }

  return (
    // 6. CAMBIA LA CLASE CSS
    <div className="tickets-page">
      <h1>Mis Tickets</h1>
      
      <div className="ordenes-lista">
        {ordenes.map(orden => (
          <div key={orden.id} className="orden-card">
            <div className="orden-header">
              <div>
                <span className="orden-id">Orden #{orden.id}</span>
                <span className={`orden-status ${orden.estadoPago.toLowerCase()}`}>
                  {orden.estadoPago}
                </span>
              </div>
              <div className="orden-total">
                Total: S/ {orden.total.toFixed(2)}
              </div>
            </div>
            
            <div className="tickets-lista">
              {orden.tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-icon">
                    <FaTicketAlt />
                  </div>
                  <div className="ticket-info">
                    <span className="ticket-evento">{ticket.tipoTicket.evento.nombre}</span>
                    <span className="ticket-tipo">{ticket.tipoTicket.nombre}</span>
                    <span className="ticket-propietario">
                      {ticket.nombre} {ticket.apellido} (DNI: {ticket.dni})
                    </span>
                  </div>
                  <button className="ticket-qr" onClick={() => handleShowQr(ticket.id)}>
                    <FaQrcode />
                    <span>Ver QR</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {qrModalUrl && (
        <div className="qr-modal-overlay" onClick={() => setQrModalUrl(null)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Escanea tu entrada</h3>
            <img src={qrModalUrl} alt="Código QR del Ticket" />
            <button onClick={() => setQrModalUrl(null)} className="qr-modal-close">Cerrar</button>
          </div>
        </div>
      )}

      {/* (Opcional) Pantalla de carga mientras se genera el QR */}
      {loadingQr && (
         <div className="qr-modal-overlay">
           <div className="qr-modal-content">
             <h3>Generando QR...</h3>
           </div>
         </div>
      )}
    </div>
  );
}

export default TicketsPage; // 👈 7. CAMBIA EL EXPORT