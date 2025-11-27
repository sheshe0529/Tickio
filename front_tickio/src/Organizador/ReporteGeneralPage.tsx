import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Organizador.css'; // Reusamos el CSS

interface TipoTicketReporte {
  tipoNombre: string;
  unidadesVendidas: number;
  precioUnitario: number;
  totalSoles: number;
}

interface EventoReporte {
  eventoId: number;
  eventoNombre: string;
  tiposDeTicket: TipoTicketReporte[];
}

function ReporteGeneralPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState<EventoReporte[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = 'Tickio - Resumen General';
  }, []);
  useEffect(() => {
    // Protección de ruta
    if (user && user.rol !== 'Organizador') {
      alert("No tienes permisos.");
      navigate('/');
    }
    
    // Carga de datos
    if (user) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/eventos/organizador/reporte-general/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar el reporte');
          return res.json();
        })
        .then(data => {
          setReporte(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, navigate]);

  return (
    <div className="organizador-page">
      <h1>Reporte General de Ventas</h1>
      <p>Un resumen de todos tus eventos y sus tickets vendidos.</p>

      {loading && <p>Cargando reporte...</p>}
      
      {!loading && reporte.length === 0 && (
        <div className="no-data-card">
          <h3>No se encontraron reportes</h3>
          <p>Aún no tienes eventos con ventas.</p>
        </div>
      )}
      
      <div className="reporte-general-container">
        {reporte.map(evento => {
          // Calculamos el total por evento
          const totalEvento = evento.tiposDeTicket.reduce((acc, t) => acc + t.totalSoles, 0);
          
          return (
            <div key={evento.eventoId} className="reporte-evento-card">
              <h2 className="reporte-evento-nombre">Evento: {evento.eventoNombre}</h2>
              
              <div className="reporte-container">
                <div className="reporte-header">
                  <span>Tipo de Ticket</span>
                  <span>Unidades Vendidas</span>
                  <span>Precio Unit.</span>
                  <span>Total Recaudado</span>
                </div>
                
                {evento.tiposDeTicket.map(tipo => (
                  <div key={tipo.tipoNombre} className="reporte-row">
                    <span className="tipo-ticket-nombre">{tipo.tipoNombre}</span>
                    <span>{tipo.unidadesVendidas}</span>
                    <span>S/ {tipo.precioUnitario.toFixed(2)}</span>
                    <span className="total-soles">S/ {tipo.totalSoles.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="reporte-total">
                  <span>Total Evento</span>
                  <span>S/ {totalEvento.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReporteGeneralPage;