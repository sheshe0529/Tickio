import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Organizador.css'; // Reusamos el CSS

interface ReporteItem {
  tipoTicket: string;
  unidadesVendidas: number;
  precioUnitario: number;
  totalSoles: number;
}

function ReporteVentasPage() {
  const { id: eventoId } = useParams(); // ID del Evento
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState<ReporteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    document.title = 'Tickio - Reporte de Ventas';
  }, []);
  // (Opcional) Guardar nombre del evento
  const [eventoNombre, setEventoNombre] = useState(''); 

  useEffect(() => {
    if (user && user.rol !== 'Organizador') {
      alert("No tienes permisos para acceder a esta página.");
      navigate('/');
    }
    
    if (user) {
      setLoading(true);
      
      // Llamamos al endpoint de reporte que creamos
      fetch(`${import.meta.env.VITE_API_URL}/eventos/${eventoId}/reporte`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar el reporte');
          return res.json();
        })
        .then(data => {
          setReporte(data);
          // (Opcional: si el backend no manda el nombre, lo buscamos)
          // setEventoNombre(data.eventoNombre); 
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError((err as Error).message);
          setLoading(false);
        });
    }
  }, [user, navigate, eventoId]);
  
  // Calculamos el gran total
  const granTotal = reporte.reduce((acc, item) => acc + item.totalSoles, 0);

  return (
    <div className="organizador-page">
      <Link to="/organizar/eventos" className="back-link">← Volver a Mis Eventos</Link>
      <h1>Reporte de Ventas</h1>
      {/* <h2>Evento: {eventoNombre || `ID ${eventoId}`}</h2> */}
      
      {loading && <p>Cargando reporte...</p>}
      {error && <div className="form-error">{error}</div>}

      {!loading && !error && (
        <div className="reporte-container">
          <div className="reporte-header">
            <span>Tipo de Ticket</span>
            <span>Unidades Vendidas</span>
            <span>Precio Unit.</span>
            <span>Total Recaudado</span>
          </div>
          
          {reporte.map(item => (
            <div key={item.tipoTicket} className="reporte-row">
              <span className="tipo-ticket-nombre">{item.tipoTicket}</span>
              <span>{item.unidadesVendidas}</span>
              <span>S/ {item.precioUnitario.toFixed(2)}</span>
              <span className="total-soles">S/ {item.totalSoles.toFixed(2)}</span>
            </div>
          ))}
          
          <div className="reporte-total">
            <span>Total General</span>
            <span>S/ {granTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReporteVentasPage;